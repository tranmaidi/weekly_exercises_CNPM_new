import './App.css'

function App() {
  return (
    <>
      <header>
        <h1>👋 Xin chào, tôi là Tran Mai Di, mssv: 22110291</h1>
      </header>

      <main>
        <section className="intro">
          <h2>Giới thiệu</h2>
          <p>
            Tôi hiện đang là sinh viên năm cuối, đam mê lập trình web và phát triển phần mềm.
            Mục tiêu của tôi là trở thành một lập trình viên Fullstack và xây dựng những ứng dụng hữu ích cho mọi người.
          </p>
        </section>

        <section className="skills">
          <h2>Kỹ năng</h2>
          <ul>
            <li>💻 Lập trình: Java, C#, JavaScript</li>
            <li>🌐 Web: React, Node.js, Spring Boot</li>
            <li>🗄️ Cơ sở dữ liệu: MySQL, SQL Server</li>
          </ul>
        </section>

        <section className="contact">
          <h2>Liên hệ</h2>
          <p>Email: <a href="mailto:youremail@example.com">ditran.120804@gmail.com</a></p>
          <p>GitHub: <a href="https://github.com/" target="_blank">https://github.com/tranmaidi</a></p>
        </section>
      </main>

      <footer>
        <p>© 2025 Tran Mai Di - All rights reserved</p>
      </footer>
    </>
  )
}

export default App
