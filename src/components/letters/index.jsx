import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import students from '../../api/students';

gsap.registerPlugin(ScrollTrigger);

const Letters = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const modalOverlayRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);

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
        const firstCard = cardItems[0];
        const centeredStackLeft =
          cards.scrollLeft + (viewportCenter - cardsBounds.left) - firstCard.offsetWidth / 2;

        cardItems.forEach((item, index) => {
          const depth = cardItems.length - index;

          gsap.set(item, {
            x: centeredStackLeft - item.offsetLeft,
            scale: 0.92,
            filter: 'blur(10px)',
            opacity: 0.24,
            zIndex: depth,
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
        duration: 1,
        stagger: {
          each: 0.035,
          from: 0,
        },
      });

      const getMaxScroll = () => Math.max(cards.scrollWidth - cards.clientWidth, 0);

      gsap.to(cards, {
        scrollLeft: () => getMaxScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: cards,
          start: 'center center',
          end: () => `+=${getMaxScroll()}`,
          scrub: 1,
          pin: section,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: resetCardsScroll,
          onLeaveBack: resetCardsScroll,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!selectedStudent || !modalOverlayRef.current || !modalRef.current) {
      return undefined;
    }

    isClosingRef.current = false;

    const ctx = gsap.context(() => {
      gsap.set(modalOverlayRef.current, {
        opacity: 0,
      });

      gsap.set(modalRef.current, {
        opacity: 0,
        y: -24,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(modalOverlayRef.current, {
        opacity: 1,
        duration: 0.24,
      });

      timeline.to(modalRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
      }, 0);
    });

    return () => ctx.revert();
  }, [selectedStudent]);

  const openModal = (student) => {
    if (isClosingRef.current) {
      return;
    }

    setSelectedStudent(student);
  };

  const closeModal = () => {
    if (!selectedStudent || isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power3.in',
      },
      onComplete: () => {
        isClosingRef.current = false;
        setSelectedStudent(null);
      },
    });

    timeline.to(modalOverlayRef.current, {
      opacity: 0,
      duration: 0.2,
    });

    timeline.to(modalRef.current, {
      opacity: 0,
      y: -24,
      duration: 0.24,
    }, 0);
  };

  return (
    <>
      <section ref={sectionRef} className="letters">
        <div className="inner">
          <h2 className="letters-reveal">Letters From Us</h2>
          <p>
            <span className="click letters-reveal">Click on the card</span>
            <span className="letters-reveal">
             각자의 마음을 담아 전하는 작은 이야기들. 쉽게 꺼내지 못했던 진심을 한 장의 편지에 담았습니다.<br />
              사진을 눌러, 그 안에 담긴 우리의 기억과 마음을 하나씩 천천히 확인해보세요.
            </span>
          </p>
          <ul
            ref={cardsRef}
            className="cards"
          >
            {students.map((student) => (
              <li key={student.id}>
                <button
                  type="button"
                  className="card-button"
                  onClick={() => openModal(student)}
                  aria-label={`Open letter from ${student.name}`}
                >
                  <img src={student.cardImg} alt={student.name} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {selectedStudent && createPortal(
        <div
          ref={modalOverlayRef}
          className="letters-modal-overlay"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
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
              <em>{selectedStudent.name}</em>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Letters;
