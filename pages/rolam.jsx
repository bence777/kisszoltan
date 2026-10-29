import React, { useState } from 'react';
import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import Icon from '../components/Icons';
import { Header, Footer } from '../components/GlobalUI';
import { useApp } from '../components/AppContext';
import styles from '../styles/About.module.css';

// The same real portrait URL is already used by the original HomeSections/Team
// component. If the third-party host is unavailable, show a designed monogram,
// not a generated or unrelated person's photo.
const PORTRAIT_URL = 'https://ot.ingatlancdn.com/logo/referenshd/r_82613_0.jpg?v=20260212110024';

const principles = [
  {
    number: '01',
    title: 'Először az embert, aztán az ingatlant.',
    text: 'Egy értékesítés mögött mindig van egy személyes döntés. Az első beszélgetésen ezért nemcsak a négyzetméterekről, hanem a tulajdonos céljairól és az időzítésről is szó esik.',
  },
  {
    number: '02',
    title: 'Nincs két egyforma értékesítési helyzet.',
    text: 'A piaci pozicionálás, a bemutatás és az érdeklődők elérése az adott ingatlan adottságaitól függ. Különösen a nagy értékű ingatlanoknál számít, hogy kihez és milyen módon jut el az ajánlat.',
  },
  {
    number: '03',
    title: 'A folyamatnak érthetőnek kell maradnia.',
    text: 'Milyen lehetőségek vannak? Mi a következő lépés? Milyen döntés vár a tulajdonosra? Ezekre a kérdésekre az együttműködés során követhető válaszokat kell adni.',
  },
];

export default function Rolam() {
  const { setModal } = useApp();
  const [portraitFailed, setPortraitFailed] = useState(false);
  const openConsultation = () => setModal({
    type: 'lead',
    kind: 'seller',
    context: 'Kiss Zoltánnal szeretnék személyes konzultációt kérni egy ingatlan értékesítéséről.',
  });

  return <>
    <SeoHead
      path="/rolam"
      title="Kiss Zoltán – személyes történet és ingatlanszakértői szemlélet | Rólam"
      description="Ismerje meg Kiss Zoltán szakmai történetét a 2012-es pénzügyi pályakezdéstől az ingatlanközvetítésig, valamint személyes értékesítési szemléletét."
    />
    <Header />
    <main className={styles.about} id="about-main">
      <div className="container">
        <nav className={`detail-breadcrumb ${styles.breadcrumb}`} aria-label="Morzsanavigáció">
          <Link href="/">Főoldal</Link><span>/</span><span aria-current="page">Rólam</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.sectionEyebrow}><span className={styles.eyebrowLine} /> AZ INGATLAN MÖGÖTT AZ EMBER</div>
            <h1>Kiss Zoltán<span className={styles.fullStop}>.</span><br/><em>Személyes ügy.</em></h1>
            <p className={styles.heroLead}>Számomra az ingatlanközvetítés nem egy hirdetés feladásával kezdődik. Hanem azzal, hogy megértem, mit jelent a tulajdonos számára az ingatlan, és mi a célja az értékesítéssel.</p>
            <div className={styles.heroActions}>
              <button type="button" className="btn btn-primary" onClick={openConsultation}>Beszéljünk személyesen <Icon name="arrow" size={18}/></button>
              <a href="#tortenetem" className={styles.textAction}>Ismerje meg a történetem <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.heroFootnote}><span className={styles.footnoteIndex}>01 / 03</span><span>INGATLANSZAKÉRTŐ · BUDAPEST ÉS KÖRNYÉKE</span></div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.portraitFrame}>
              {!portraitFailed ? <img src={PORTRAIT_URL} alt="Kiss Zoltán ingatlanszakértő portréja" className={styles.portrait} onError={() => setPortraitFailed(true)} loading="eager" fetchPriority="high" /> :
                <div className={styles.portraitFallback} aria-label="Kiss Zoltán – személyes bemutatkozás"><span>KZ</span><small>KISS ZOLTÁN<br/>INGATLANSZAKÉRTŐ</small></div>}
              <div className={styles.portraitScrim} aria-hidden="true" />
              <div className={styles.portraitCaption}><span>AZ ÖN SZEMÉLYES KAPCSOLATTARTÓJA</span><strong>Kiss Zoltán</strong></div>
            </div>
            <div className={styles.visualIndex} aria-hidden="true"><span>KZ</span><span>— 01</span></div>
          </div>
        </header>
      </div>

      <section id="tortenetem" className={styles.story} aria-labelledby="story-heading">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyAside}>
              <div className={styles.sectionEyebrow}><span className={styles.eyebrowLine}/> AZ ÚT, AMI IDE VEZETETT</div>
              <div className={styles.year}>2012<span>.</span></div>
              <div className={styles.yearCaption}>A szakmai pályám<br/>kezdete.</div>
              <div className={styles.storyRule}/>
              <p>Nem az ingatlanpiacon indultam. De már akkor is emberekkel, döntésekkel és bizalommal foglalkoztam.</p>
            </div>
            <div className={styles.storyText}>
              <h2 id="story-heading">Egy történet, ami <em>nem az ingatlanokkal</em> kezdődött.</h2>
              <p className={styles.storyIntro}>A pályám 2012-ben, a pénzügyi értékesítés területén indult. Itt tanultam meg, hogy egy jó döntéshez nem elég az információ: meg kell érteni a másik ember helyzetét is.</p>
              <p>Az ingatlanközvetítés felé később a nagyapám példája és biztatása terelt. Számomra ez a szakma így nem pusztán egy új területet, hanem egy személyes kapcsolódást is jelentett.</p>
              <p>Ma is ezt a szemléletet tartom fontosnak: odafigyelni a részletekre, megérteni a célt, és végig képviselni azt, aki bizalmat szavaz nekem.</p>
              <div className={styles.signatureLine}><span aria-hidden="true">KZ.</span><div><strong>Kiss Zoltán</strong><small>INGATLANSZAKÉRTŐ</small></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statement} aria-label="Szakmai szemlélet">
        <div className="container">
          <div className={styles.statementInner}>
            <div className={styles.statementLabel}>A SZEMLÉLETEM / 02</div>
            <p>Az ingatlan értékét számokkal is le lehet írni. <em>A képviselet minőségét a döntések mutatják meg.</em></p>
            <Link href="/ingatlan-ertekesites-folyamata" className={styles.statementLink}>Hogyan zajlik az értékesítés? <Icon name="arrow" size={18}/></Link>
          </div>
        </div>
      </section>

      <section className={styles.approach} id="szemlelet" aria-labelledby="approach-heading">
        <div className="container">
          <div className={styles.approachHeading}>
            <div>
              <div className={styles.sectionEyebrow}><span className={styles.eyebrowLine}/> AHOGYAN DOLGOZOM</div>
              <h2 id="approach-heading">Néhány alapelv.<br/><em>Nem üres ígéretek.</em></h2>
            </div>
            <p>Minden ingatlan más történet. Az eladás módjának is ehhez kell igazodnia — a személyes konzultációtól az érdeklődők kezeléséig.</p>
          </div>
          <div className={styles.principles}>
            {principles.map(item => <article className={styles.principle} key={item.number}>
              <span className={styles.principleNumber}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>)}
          </div>
          <div className={styles.approachBottom}>
            <span>AZ ELSŐ LÉPÉS NEM ELKÖTELEZŐDÉS, HANEM EGY BESZÉLGETÉS.</span>
            <Link href="/eladni-szeretnek">Ingatlanértékesítésről bővebben <Icon name="arrow" size={18}/></Link>
          </div>
        </div>
      </section>

      <section className={styles.outro} aria-labelledby="outro-heading">
        <div className="container">
          <div className={styles.outroGrid}>
            <div className={styles.outroImage} role="img" aria-label="Budapest látképe az Országházzal" />
            <div className={styles.outroCopy}>
              <div className={styles.sectionEyebrow}><span className={styles.eyebrowLine}/> AMIT ÉRDEMES TOVÁBB MEGNÉZNI</div>
              <h2 id="outro-heading">A szemlélet után<br/><em>jöjjenek a részletek.</em></h2>
              <p>A szakmai történetem csak a kiindulópont. Ismerje meg a bemutatott ingatlanokat, az értékesítés menetét és a kapcsolatfelvétel lehetőségeit.</p>
              <div className={styles.outroLinks}>
                <Link href="/ingatlanjaim"><span>01</span> Aktuális ingatlanok <Icon name="upRight" size={19}/></Link>
                <Link href="/ingatlan-ertekesites-folyamata"><span>02</span> Az értékesítés folyamata <Icon name="upRight" size={19}/></Link>
                <Link href="/tudastar"><span>03</span> Szakmai útmutatók <Icon name="upRight" size={19}/></Link>
              </div>
            </div>
          </div>
                  </div>
      </section>
    </main>
    <Footer />
  </>;
}
