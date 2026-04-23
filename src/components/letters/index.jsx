import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import students from '../../api/students';

gsap.registerPlugin(ScrollTrigger);

const Letters = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const dragAnimationRef = useRef({
    frameId: null,
    currentScrollLeft: 0,
    targetScrollLeft: 0,
  });
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

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

  useEffect(() => {
    return () => {
      if (dragAnimationRef.current.frameId) {
        cancelAnimationFrame(dragAnimationRef.current.frameId);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) {
      return undefined;
    }

    const cardItems = Array.from(cards.querySelectorAll('li'));
    const revealItems = Array.from(section.querySelectorAll('.letters-reveal'));

    if (!cardItems.length) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const resetCardsScroll = () => {
        cards.scrollLeft = 0;
      };

      const setStackedState = () => {
        const cardsBounds = cards.getBoundingClientRect();
        const viewportCenter = window.innerWidth / 2;
        const stackCenter =
          cards.scrollLeft + (viewportCenter - cardsBounds.left);
        const centerIndex = (cardItems.length - 1) / 2;

        cardItems.forEach((item, index) => {
          const itemCenter = item.offsetLeft + item.offsetWidth / 2;
          const offsetToCenter = stackCenter - itemCenter;
          const distanceFromCenter = index - centerIndex;
          const depth = Math.abs(distanceFromCenter);

          gsap.set(item, {
            x: offsetToCenter,
            scale: 0.9 - depth * 0.01,
            filter: 'blur(10px)',
            opacity: 0.22,
            zIndex: Math.round(cardItems.length - depth),
          });
        });
      };

      setStackedState();

      if (revealItems.length) {
        gsap.set(revealItems, {
          y: 48,
          opacity: 0,
          filter: 'blur(12px)',
        });

        gsap.to(revealItems, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 1,
          stagger: 0.18,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top 40%',
          end: 'top 8%',
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            resetCardsScroll();
            setStackedState();
          },
          onLeaveBack: () => {
            resetCardsScroll();
            setStackedState();
          },
        },
      });

      timeline.to(cardItems, {
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        opacity: 1,
        stagger: {
          each: 0.04,
          from: 'center',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const openModal = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handlePointerDown = (event) => {
    const cards = cardsRef.current;

    if (!cards || event.pointerType === 'touch') {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: cards.scrollLeft,
      moved: false,
    };

    dragAnimationRef.current.currentScrollLeft = cards.scrollLeft;
    dragAnimationRef.current.targetScrollLeft = cards.scrollLeft;
    cards.classList.add('is-dragging');
  };

  const animateDragScroll = () => {
    const cards = cardsRef.current;

    if (!cards) {
      dragAnimationRef.current.frameId = null;
      return;
    }

    const animation = dragAnimationRef.current;
    const distance = animation.targetScrollLeft - animation.currentScrollLeft;

    animation.currentScrollLeft += distance * 0.18;

    if (Math.abs(distance) < 0.5) {
      animation.currentScrollLeft = animation.targetScrollLeft;
      cards.scrollLeft = animation.currentScrollLeft;
      animation.frameId = null;
      return;
    }

    cards.scrollLeft = animation.currentScrollLeft;
    animation.frameId = requestAnimationFrame(animateDragScroll);
  };

  const ensureDragAnimation = () => {
    if (!dragAnimationRef.current.frameId) {
      dragAnimationRef.current.frameId = requestAnimationFrame(animateDragScroll);
    }
  };

  const handlePointerMove = (event) => {
    const cards = cardsRef.current;
    const dragState = dragStateRef.current;

    if (!cards || !dragState.isDragging) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 5) {
      dragState.moved = true;
    }

    if (dragState.moved) {
      event.preventDefault();
    }

    dragAnimationRef.current.targetScrollLeft = dragState.startScrollLeft - deltaX;
    ensureDragAnimation();
  };

  const endDragging = () => {
    const cards = cardsRef.current;

    if (!cards || !dragStateRef.current.isDragging) {
      return;
    }

    cards.classList.remove('is-dragging');
    dragStateRef.current.isDragging = false;
    ensureDragAnimation();
  };

  const handleCardClick = (student) => {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }

    openModal(student);
  };

  return (
    <section ref={sectionRef} className="letters">
      <div className="inner">
        <h2 className="letters-reveal">Letters From Us</h2>
        <p>
          <span className="click letters-reveal">Click on the card</span>
          <span className="letters-reveal">
            각자의 마음을 담아 전하는 작은 이야기들. 쉽게 꺼내지 못했던 진심을 한 장의 편지에 담았습니다. <br />
            사진을 눌러, 그 안에 담긴 우리의 기억과 마음을 하나씩 천천히 확인해보세요.
          </span>
        </p>
        <ul
          ref={cardsRef}
          className="cards"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDragging}
          onPointerLeave={endDragging}
          onPointerCancel={endDragging}
        >
          {students.map((student) => (
            <li
              key={student.id}
              onClick={() => handleCardClick(student)}
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
              CLOSE
            </button>
            <div className="letters-modal-content">
              <p>{selectedStudent.letter}</p>
              <em>{selectedStudent.name} 올림</em>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Letters;
