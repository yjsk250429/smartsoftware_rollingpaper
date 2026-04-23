import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Photos = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const items = Array.from(section.querySelectorAll('.photos-reveal'));

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
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="photos">
      <div className="inner">
        <h2 className="photos-reveal">Moments We Shared</h2>
        <p className="photos-reveal">
          흘러가는 순간 속에서 무심코 지나쳤던 장면들이 이제는 가장 소중한 기억이 되었습니다. <br />
          그 시간을 다시 한 번 꺼내봅니다.
        </p>
      </div>
    </section>
  );
};

export default Photos;
