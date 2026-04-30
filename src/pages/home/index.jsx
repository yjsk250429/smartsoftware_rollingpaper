import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Letters, MLetters, Photos, Teacher } from "../../components";
import Banner from "../../components/banner";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const memoriseRef = useRef(null);
  const [showTopButton, setShowTopButton] = useState(false);

  useLayoutEffect(() => {
    const memorise = memoriseRef.current;

    if (!memorise) {
      return undefined;
    }

    const items = Array.from(memorise.querySelectorAll(".memorise-reveal"));

    if (!items.length) {
      return undefined;
    }

    let media;
    let refreshCall;

    const ctx = gsap.context(() => {
      media = gsap.matchMedia();
      media.add("(min-width: 481px)", () => {
        gsap.set(items, {
          opacity: 0,
          filter: "blur(12px)",
        });

        ScrollTrigger.create({
          trigger: memorise,
          start: "center center",
          end: () => ScrollTrigger.maxScroll(window),
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: memorise,
            start: "center center",
            end: "+=1500",
            scrub: 2,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        timeline
          .to("h2", {
            opacity: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 4,
          })
          .to(".t1", {
            opacity: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 4,
          })
          .to(
            ".t2",
            {
              opacity: 1,
              filter: "blur(0px)",
              ease: "power3.out",
              duration: 4,
            },
            "+=0.25",
          );

        refreshCall = gsap.delayedCall(0, () => ScrollTrigger.refresh());
      });
    }, memorise);

    return () => {
      refreshCall?.kill();
      media?.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      <div className="memorise-spacer" aria-hidden="true" />
      <Teacher />
      <Letters />
      <MLetters />
      <Photos />
      <button
        type="button"
        className={`top-button${showTopButton ? " is-visible" : ""}`}
        onClick={handleTopClick}
        aria-label="Scroll to top"
      >
        <span className="top-button-arrow" aria-hidden="true" />
      </button>
    </main>
  );
};

export default Home;
