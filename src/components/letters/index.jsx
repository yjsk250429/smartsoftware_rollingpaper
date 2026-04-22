import students from '../../api/students';
const Letters = () => {
  return (
    <section className="letters">
      <div className="inner">
        <h2>Letters From Us</h2>
        <p>
          <span className="click">Click on the card</span>
          <span>각자의 마음을 담아 전하는 작은 이야기들. 쉽게 꺼내지 못했던 진심을 한 장의 편지에 담았습니다.<br/> 사진을 눌러, 그 안에 담긴 우리의 기억과 마음을 하나씩 천천히 확인해보세요.</span>
        </p>
        <ul className="cards">
           {students.map((student) => (
            <li key={student.id}>
              <img src={student.cardImg} alt={student.name} />
            </li>
          ))}
          
          <li></li>
        </ul>
      </div>
    </section>
  )
}

export default Letters