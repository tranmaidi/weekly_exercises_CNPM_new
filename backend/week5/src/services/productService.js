const Product = require("../models/Product");
const Category = require("../models/Category");
const esClient = require("../config/elasticsearch");

// Tạo sản phẩm mới
const createProductService = async (name, price, categoryId, thumbnail) => {
  try {
    // check danh mục có tồn tại không
    const category = await Category.findById(categoryId);
    if (!category) {
      return {
        EC: 2,
        EM: "Danh mục không tồn tại"
      };
    }

    // tạo sản phẩm
    const product = await Product.create({
      name,
      price,
      category: categoryId,
      thumbnail,
      isActive: true
    });

    // index to Elasticsearch
    try {
      await esClient.index({
        index: 'products',
        id: String(product._id),
        document: {
          name: product.name,
          description: '',
          price: product.price,
          categorySlug: category.slug,
          createdAt: product.createdAt
        }
      });
      await esClient.indices.refresh({ index: 'products' });
    } catch (e) {
      console.error('ES index(create) error', e.meta?.body || e);
    }

    return {
      EC: 0,
      EM: "Tạo sản phẩm thành công",
      DT: product
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Lỗi server"
    };
  }
};
// Lấy chi tiết 1 sản phẩm
const getProductByIdService = async (id) => {
  try {
    const product = await Product.findById(id).populate("category", "name slug");
    if (!product) {
      return {
        EC: 2,
        EM: "Không tìm thấy sản phẩm"
      };
    }
    return {
      EC: 0,
      EM: "Lấy sản phẩm thành công",
      DT: product
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Lỗi server"
    };
  }
};

// Cập nhật sản phẩm
const updateProductService = async (id, data) => {
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true }).populate('category','slug');
    if (!product) {
      return {
        EC: 2,
        EM: "Không tìm thấy sản phẩm để cập nhật"
      };
    }
    // update ES
    try {
      await esClient.index({
        index: 'products',
        id: String(product._id),
        document: {
          name: product.name,
          description: '',
          price: product.price,
          categorySlug: product?.category?.slug || '',
          createdAt: product.createdAt
        }
      });
      await esClient.indices.refresh({ index: 'products' });
    } catch (e) {
      console.error('ES index(update) error', e.meta?.body || e);
    }
    return {
      EC: 0,
      EM: "Cập nhật sản phẩm thành công",
      DT: product
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Lỗi server"
    };
  }
};

// Xoá sản phẩm
const deleteProductService = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return {
        EC: 2,
        EM: "Không tìm thấy sản phẩm để xoá"
      };
    }
    // delete from ES
    try {
      await esClient.delete({ index: 'products', id: String(id) });
    } catch (e) {
      // ignore not_found
      if (e?.meta?.statusCode !== 404) {
        console.error('ES delete error', e.meta?.body || e);
      }
    }
    return {
      EC: 0,
      EM: "Xoá sản phẩm thành công"
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Lỗi server"
    };
  }
};

// Lấy danh sách sản phẩm (phân trang + lọc)
const listProductsService = async (
  page = 1,
  limit = 12,
  category,
  q,
  sort = "createdAt:desc",
  extra = {}
) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

    // parse sort
    let [sortField, sortDir] = String(sort).split(":");
    if (!sortField) sortField = "createdAt";
    const sortOption = { [sortField]: sortDir === "asc" ? 1 : -1 };

    const filter = { isActive: true };

    if (q) {
      if (String(extra?.fuzzy) === 'true') {
        filter.name = { $regex: q, $options: 'i' }; // simple fuzzy via regex
      } else {
        filter.$text = { $search: q };
      }
    }

    // price range
    const priceMin = extra?.priceMin ? Number(extra.priceMin) : undefined;
    const priceMax = extra?.priceMax ? Number(extra.priceMax) : undefined;
    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {};
      if (priceMin !== undefined) filter.price.$gte = priceMin;
      if (priceMax !== undefined) filter.price.$lte = priceMax;
    }

    // promotion
    const hasPromotion = String(extra?.hasPromotion) === 'true';
    const promotionMin = extra?.promotionMin ? Number(extra.promotionMin) : undefined;
    if (hasPromotion) {
      filter.promotionPercent = { $gt: 0 };
      if (promotionMin !== undefined) filter.promotionPercent.$gte = promotionMin;
    } else if (promotionMin !== undefined) {
      filter.promotionPercent = { $gte: promotionMin };
    }

    // views range
    const viewsMin = extra?.viewsMin ? Number(extra.viewsMin) : undefined;
    const viewsMax = extra?.viewsMax ? Number(extra.viewsMax) : undefined;
    if (viewsMin !== undefined || viewsMax !== undefined) {
      filter.views = {};
      if (viewsMin !== undefined) filter.views.$gte = viewsMin;
      if (viewsMax !== undefined) filter.views.$lte = viewsMax;
    }

    if (category) {
      let categoryDoc = null;
      if (/^[a-f\d]{24}$/i.test(category)) {
        categoryDoc = await Category.findById(category).lean();
      } else {
        categoryDoc = await Category.findOne({ slug: category }).lean();
      }
      if (!categoryDoc) {
        return { EC: 2, EM: "Category not found" }; // ❗️service chỉ return object
      }
      filter.category = categoryDoc._id;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .populate("category", "name slug"),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
      EC: 0,
      EM: "OK",
      DT: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        items,
      }
    };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Server error" };
  }
};

// Lấy sản phẩm theo slug category
const listProductsByCategorySlugService = async (
  slug,
  page = 1,
  limit = 12,
  q,
  sort = "createdAt:desc",
  extra = {}
) => {
  try {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

    const categoryDoc = await Category.findOne({ slug }).lean();
    if (!categoryDoc) {
      return { EC: 2, EM: "Category not found" };
    }

    // parse sort
    let [sortField, sortDir] = String(sort).split(":");
    if (!sortField) sortField = "createdAt";
    const sortOption = { [sortField]: sortDir === "asc" ? 1 : -1 };

    const filter = { isActive: true, category: categoryDoc._id };
    if (q) {
      if (String(extra?.fuzzy) === 'true') {
        filter.name = { $regex: q, $options: 'i' };
      } else {
        filter.$text = { $search: q };
      }
    }

    const priceMin = extra?.priceMin ? Number(extra.priceMin) : undefined;
    const priceMax = extra?.priceMax ? Number(extra.priceMax) : undefined;
    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {};
      if (priceMin !== undefined) filter.price.$gte = priceMin;
      if (priceMax !== undefined) filter.price.$lte = priceMax;
    }

    const hasPromotion = String(extra?.hasPromotion) === 'true';
    const promotionMin = extra?.promotionMin ? Number(extra.promotionMin) : undefined;
    if (hasPromotion) {
      filter.promotionPercent = { $gt: 0 };
      if (promotionMin !== undefined) filter.promotionPercent.$gte = promotionMin;
    } else if (promotionMin !== undefined) {
      filter.promotionPercent = { $gte: promotionMin };
    }

    const viewsMin = extra?.viewsMin ? Number(extra.viewsMin) : undefined;
    const viewsMax = extra?.viewsMax ? Number(extra.viewsMax) : undefined;
    if (viewsMin !== undefined || viewsMax !== undefined) {
      filter.views = {};
      if (viewsMin !== undefined) filter.views.$gte = viewsMin;
      if (viewsMax !== undefined) filter.views.$lte = viewsMax;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .populate("category", "name slug"),
      Product.countDocuments(filter),
    ]);

    return {
      EC: 0,
      EM: "OK",
      DT: {
        category: {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          slug: categoryDoc.slug,
        },
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        items,
      },
    };
  } catch (err) {
    console.error(err);
    return { EC: 1, EM: "Server error" };
  }
};

module.exports = {
  createProductService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  listProductsService,
  listProductsByCategorySlugService,
};
