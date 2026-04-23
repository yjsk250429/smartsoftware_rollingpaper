import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import galleryPhotos from '../../api/gallery';

gsap.registerPlugin(ScrollTrigger);

const Photos = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const textItems = Array.from(section.querySelectorAll('.photos-reveal'));
    const frameItems = Array.from(section.querySelectorAll('.photo-frame'));

    if (!textItems.length && !frameItems.length) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (textItems.length) {
        gsap.set(textItems, {
          y: 48,
          opacity: 0,
          filter: 'blur(12px)',
        });

        gsap.to(textItems, {
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

      if (frameItems.length) {
        const orderedFrameItems = [...frameItems].sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          const rowGap = Math.abs(aRect.top - bRect.top);

          if (rowGap > 8) {
            return aRect.top - bRect.top;
          }

          return aRect.left - bRect.left;
        });

        gsap.set(orderedFrameItems, {
          scale: 0.3,
          opacity: 0,
          filter: 'blur(9px)',
          transformOrigin: 'center center',
        });

        orderedFrameItems.forEach((item) => {
          gsap.to(item, {
            opacity: 1,
            filter: 'blur(0px)',
            keyframes: [
              {
                scale: 1.03,
                duration: 0.42,
                ease: 'back.out(2.1)',
              },
              {
                scale: 1,
                duration: 0.32,
                ease: 'power2.out',
              },
            ],
            duration: 0.74,
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="photos">
      <div className="inner">
        <div className="photos-head">
          <h2 className="photos-reveal">Moments We Shared</h2>
          <p className="photos-reveal">
            흘러가는 순간 속에서 무심코 지나쳤던 장면들이 이제는 가장 소중한 기억이 되었습니다.<br />
            그 시간을 다시 한 번 꺼내 봅니다.
          </p>
        </div>

        <div className="photos-collage" aria-label="Photo collage placeholders">
          {galleryPhotos.map((photo) => (
            <div key={photo.id} className={`photo-frame ${photo.className}`}>
              <img src={photo.src} alt={photo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Photos;
