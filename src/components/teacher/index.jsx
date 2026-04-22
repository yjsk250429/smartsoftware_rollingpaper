const Teacher = () => {
  return (
   <section className="teacher">
    <div className="inner">
      <div className="left">
        <div className="img-wrap">
          <img src="/images/yoont.jpg" alt="yoonjihyun" />
        </div>
      </div>
      <div className="right">
        <em>About Our Teacher</em>
        <strong>Yoon Ji Hyun<span>윤지현</span></strong>
        <p>스마트소프트웨어공학과 교수</p>
        <ul className="tags">
          <li>#PASSION</li>
          <li>#WISDOM</li>
          <li>#KINDNESS</li>
        </ul>
      </div>
    </div>
   </section>
  )
}

export default Teacher;