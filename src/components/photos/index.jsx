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
        const frameItems = Array.from(section.querySelectorAll('.photos-collage--desktop .photo-frame'));

        if (!textItems.length && !frameItems.length) {
            return undefined;
        }

        let media;

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

            media = gsap.matchMedia();

            media.add('(max-width: 480px)', () => {
                const mobileFrameItems = Array.from(
                    section.querySelectorAll('.photos-marquee .photo-frame')
                );
                const marquee = section.querySelector('.photos-marquee');

                if (!mobileFrameItems.length || !marquee) {
                    return undefined;
                }

                const getScaleToCloseGap = () => {
                    const firstFrame = mobileFrameItems[0];
                    const frameWidth = firstFrame.getBoundingClientRect().width;
                    const frameParent = firstFrame.parentElement;
                    const parentStyles = window.getComputedStyle(frameParent);
                    const gap = parseFloat(parentStyles.columnGap || parentStyles.gap) || 0;

                    if (!frameWidth || !gap) {
                        return 1.08;
                    }

                    return 1 + ((gap + 3) * 2) / frameWidth;
                };

                gsap.set(mobileFrameItems, {
                    scale: 1,
                    transformOrigin: 'center center',
                    borderRadius: '8px',
                    clipPath: 'inset(0 round 8px)',
                    overflow: 'hidden',
                    force3D: true,
                });

                gsap.set(section.querySelectorAll('.photos-marquee .photo-frame img'), {
                    scale: 1,
                    transform: 'none',
                    transformOrigin: 'center center',
                });

                gsap.to(mobileFrameItems, {
                    keyframes: [
                        {
                            scale: getScaleToCloseGap,
                            duration: 0.46,
                            ease: 'power2.out',
                        },
                        {
                            scale: 1,
                            duration: 0.52,
                            ease: 'power2.out',
                        },
                    ],
                    stagger: 0.035,
                    scrollTrigger: {
                        trigger: marquee,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                        invalidateOnRefresh: true,
                    },
                });

                return undefined;
            });
        }, section);

        return () => {
            media?.revert();
            ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="photos">
            <div className="inner">
                <div className="photos-head">
                    <h2 className="photos-reveal">Moments We Shared</h2>
                    <p className="photos-reveal">
                        흘러가는 순간 속에서 무심코 지나쳤던 장면들이 이제는
                        <br className="br-hide" /> 가장 소중한 기억이 되었습니다.
                        <br className="br-show" />그 시간을 다시 한 번 꺼내 봅니다.
                    </p>
                </div>

                <div className="photos-collage photos-collage--desktop" aria-label="Photo collage placeholders">
                    {galleryPhotos.map((photo) => (
                        <div key={photo.id} className={`photo-frame ${photo.className}`}>
                            <img src={photo.src} alt={photo.alt} />
                        </div>
                    ))}
                </div>

                <div className="photos-marquee" aria-hidden="true">
                    <div className="photos-marquee-track">
                        {[0, 1].map((setIndex) => (
                            <div key={setIndex} className="photos-marquee-set">
                                {galleryPhotos.map((photo) => (
                                    <div
                                        key={`${photo.id}-${setIndex}`}
                                        className={`photo-frame ${photo.className}`}
                                    >
                                        <img src={photo.src} alt="" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Photos;
