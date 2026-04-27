import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Letters, Photos, Teacher } from '../../components';
import Banner from '../../components/banner';
import './style.scss';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const memoriseRef = useRef(null);
  const [showTopButton, setShowTopButton] = useState(false);

  useLayoutEffect(() => {
    const memorise = memoriseRef.current;

    if (!memorise) {
      return undefined;
    }

    const items = Array.from(memorise.querySelectorAll('.memorise-reveal'));

    if (!items.length) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, {
        y: 48,
        opacity: 0,
        filter: 'blur(12px)',
      });

      gsap.to(items, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power3.out',
        duration: 1,
        stagger: 0.18,
        scrollTrigger: {
          trigger: memorise,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });
    }, memorise);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 200);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="home">
      <Banner />
      <div ref={memoriseRef} className="memorise">
        <h2 className="memorise-reveal">Memorise</h2>
        <p className="t1 memorise-reveal">
          소중한 순간들을 담은 특별한 공간입니다.
        </p>
        <p className="t2 memorise-reveal">
          “시간이 지나도 변하지 않는 아름다운 추억들"
        </p>
      </div>
      <Teacher />
      <Letters />
      <Photos />
      <button
        type="button"
        className={`top-button${showTopButton ? ' is-visible' : ''}`}
        onClick={handleTopClick}
        aria-label="Scroll to top"
      >
        <span className="top-button-arrow" aria-hidden="true" />
      </button>
    </main>
  );
};

export default Home;
