import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const petalImages = Array.from({ length: 12 }, (_, index) => `/images/flowers/꽃잎${index + 1}.png`);

const createPetals = (count = 16) => (
  Array.from({ length: count }, (_, index) => ({
    id: `petal-${index}`,
    src: petalImages[index % petalImages.length],
    left: `${-8 + Math.random() * 86}%`,
    size: `${44 + Math.random() * 34}px`,
    duration: `${10 + Math.random() * 7}s`,
    delay: `${Math.random() * -12}s`,
    drift: `${30 + Math.random() * 54}px`,
    diagonal: `${110 + Math.random() * 140}px`,
    swayDuration: `${5.5 + Math.random() * 3.5}s`,
    rotateDuration: `${5 + Math.random() * 4.5}s`,
    opacity: 0.35 + Math.random() * 0.4,
  }))
);

const Teacher = () => {
  const sectionRef = useRef(null);
  const petalsRef = useRef(createPetals());

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const items = Array.from(section.querySelectorAll('.teacher-reveal'));

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
   <section ref={sectionRef} className="teacher">
    <div className="teacher-petals" aria-hidden="true">
      {petalsRef.current.map((petal) => (
        <span
          key={petal.id}
          className="teacher-petal"
          style={{
            '--petal-left': petal.left,
            '--petal-size': petal.size,
            '--petal-duration': petal.duration,
            '--petal-delay': petal.delay,
            '--petal-drift': petal.drift,
            '--petal-diagonal': petal.diagonal,
            '--petal-rotate-duration': petal.rotateDuration,
            '--petal-opacity': petal.opacity,
          }}
        >
          <span
            className="teacher-petal-body"
            style={{
              '--petal-sway-duration': petal.swayDuration,
            }}
          >
            <img src={petal.src} alt="" />
          </span>
        </span>
      ))}
    </div>
      <div className="memorise-m">
        <h2 className="memorise-reveal">Memorise</h2>
        <p className="t1 memorise-reveal">
          소중한 순간들을 담은 특별한 공간입니다.
        </p>
        <p className="t2 memorise-reveal">
          “시간이 지나도 변하지 않는 아름다운 추억들"
        </p>
      </div>
    <div className="inner">
      <div className="left">
        <div className="img-wrap teacher-reveal">
          <img src="/images/yoont.jpg" alt="yoonjihyun" />
        </div>
      </div>
      <div className="right">
        <em className="teacher-reveal">About Our Teacher</em>
        <strong className="teacher-reveal">Yoon Ji Hyun<span>윤지현</span></strong>
        <p className="teacher-reveal">컴퓨터공학과 교수 / 미술학 박사<br/>조기취업형 계약학과 센터장<br/>
        스마트SW공학과 전담교수</p>
        <p className="teacher-reveal">백석문화대학교<br/>
        <ul>
          <li><b>T</b>041.550.0613</li>
          <li><b>F</b>041.550.0718</li>
          <li><b>M</b>010.4657.6486</li>
          <li><b>E</b>gaon_in@bscu.ac.kr</li>
          </ul> </p>
        <ul className="tags teacher-reveal">
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
