import { useEffect, useState } from 'react';
import students from '../../api/students';

const Letters = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (selectedStudent) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedStudent]);

  const openModal = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  return (
    <section className="letters">
      <div className="inner">
        <h2>Letters From Us</h2>
        <p>
          <span className="click">Click on the card</span>
          <span>각자의 마음을 담아 전하는 작은 이야기들. 쉽게 꺼내지 못했던 진심을 한 장의 편지에 담았습니다. <br />사진을 눌러, 그 안에 담긴 우리의 기억과 마음을 하나씩 천천히 확인해보세요.</span>
        </p>
        <ul className="cards">
          {students.map((student) => (
            <li
              key={student.id}
              onClick={() => openModal(student)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openModal(student);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img src={student.cardImg} alt={student.name} />
            </li>
          ))}
        </ul>
      </div>

      {selectedStudent && (
        <div className="letters-modal-overlay" onClick={closeModal}>
          <div
            className="letters-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="letters-modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              X
            </button>
            <div className="letters-modal-content">
              <p>{selectedStudent.letter}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Letters;
