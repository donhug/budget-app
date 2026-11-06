import style from "./ScrollBubble.module.css";
import { FaFloppyDisk, FaArrowUp } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
function ScrollBubble() {
  const save = "Vers la sauvegarde";
  const top = "Haut de page";
  const sentinelRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  function handleClick() {
    window.scrollTo({
      top: isAtBottom === false ? document.documentElement.scrollHeight : 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsAtBottom(entries[0].isIntersecting);
    });
    observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <>
      <button
        type="button"
        className={style.bubble}
        aria-label={!isAtBottom ? save : top}
        onClick={handleClick}
      >
        {!isAtBottom ? <FaFloppyDisk /> : <FaArrowUp />}

        <span className={style.label}>{!isAtBottom ? save : top}</span>
      </button>
      <div ref={sentinelRef} className={style.sentinel}></div>
    </>
  );
}
export default ScrollBubble;
