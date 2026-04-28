import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import students from '../../api/students';

const MLetters = () => {
   return (
        <section className="mLetters">
            <div className="inner">
                   <h2 className="letters-reveal">Letters From Us</h2>
                    <p>
                       
                        <span className="letters-reveal">
                            각자의 마음을 담아 전하는 작은 이야기들.
                            <br className="br-hide" />
                            쉽게 꺼내지 못했던 진심을 한 장의 편지에 담았습니다.
                          
                        </span>
                    </p>

  <Swiper
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {students.map((student) => (
          <SwiperSlide key={student.id}>
            <img src={student.cardImg} alt={student.name} />
          </SwiperSlide>
        ))}
      </Swiper>


                     <span className="click letters-reveal">Click on the card</span>
            </div>
        </section>
    );
};

export default MLetters;
