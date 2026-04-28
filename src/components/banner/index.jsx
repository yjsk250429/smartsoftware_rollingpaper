import { useEffect, useState } from 'react';

const mobileLines = [
  '교수님과 함께한 하루하루가 우리에게는 큰 힘이 되었습니다.',
  '그 따뜻함을 잊지 않겠습니다.',
];

const Banner = () => {
  const [typedLines, setTypedLines] = useState(['', '']);
  const [activeLine, setActiveLine] = useState(0);
  const [showText, setShowText] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timers = [];
    const intervals = [];

    const runTyping = () => {
      setShowText(true);
      setShowCursor(true);
      setActiveLine(0);
      setTypedLines(['', '']);

      let elapsed = 0;

      mobileLines.forEach((line, lineIndex) => {
        timers.push(
          setTimeout(() => {
            setActiveLine(lineIndex);
          }, elapsed)
        );

        Array.from(line).forEach((_, charIndex) => {
          elapsed += 77;
          timers.push(
            setTimeout(() => {
              setTypedLines((prevLines) => {
                const nextLines = [...prevLines];
                nextLines[lineIndex] = line.slice(0, charIndex + 1);
                return nextLines;
              });
            }, elapsed)
          );
        });

        elapsed += 260;
      });

      timers.push(
        setTimeout(() => {
          let blinkCount = 0;
          const blink = setInterval(() => {
            blinkCount += 1;
            setShowCursor((current) => !current);

            if (blinkCount >= 8) {
              clearInterval(blink);
              setShowText(false);

              timers.push(
                setTimeout(() => {
                  runTyping();
                }, 360)
              );
            }
          }, 360);
          intervals.push(blink);
        }, elapsed + 300)
      );
    };

    runTyping();

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return (
    <section className='banner'>
        <div className="inner">
            <h2 className="adamina-title">
              <span className="typing-text">
                <span className="typing-text-inner">Dear. Teacher</span>
              </span>
            </h2>
            <p className="banner-desktop-copy">교수님과 함께한 하루하루가<br className="mobile-hide-br"/> 우리에게는 큰 힘이 되었습니다.<br/>그 따뜻함을 잊지 않겠습니다</p>
            <p className={`banner-mobile-copy${showText ? '' : ' is-hidden'}`}>
              {typedLines.map((line, index) => (
                <span className="banner-mobile-line" key={mobileLines[index]}>
                  {line}
                  {activeLine === index && (
                    <span className={`banner-mobile-cursor${showCursor ? '' : ' is-hidden'}`} />
                  )}
                </span>
              ))}
            </p>
        </div>
        </section>
  )
}

export default Banner
