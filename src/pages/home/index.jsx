import { Letters, Photos, Teacher } from '../../components';
import Banner from '../../components/banner';
import './style.scss';


const Home = () => {
  return (
    <main className='home'>
        <Banner/>
        <div className='memorise'>
        <h2>Memorise</h2>
        <p className='t1'>소중한 순간들을 담은 특별한 공간입니다.</p>
        <p className='t2'>
        “시간이 지나도 변하지 않는 아름다운 추억들"</p>
        </div>
        <Teacher/>
        <Letters/>
        <Photos/>
    </main>
  )
}

export default Home;
