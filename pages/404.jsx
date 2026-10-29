import Link from 'next/link';
import {Header,Footer} from '../components/GlobalUI';
export default function NotFound(){return <><Header/><main className="notfound"><div className="eyebrow">404 · NINCS ILYEN INGATLAN</div><h1>Ez az ajtó<br/><em>most nem nyílik.</em></h1><p>Az oldal nem található. Fedezze fel a többi otthont a válogatásunkban.</p><Link href="/#ingatlanok" className="btn btn-primary">Vissza az ingatlanokhoz →</Link></main><Footer/></>}
