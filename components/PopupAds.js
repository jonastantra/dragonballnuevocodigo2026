import Script from "next/script";
import { ENABLE_POPUP_ADS } from "@/lib/ad-settings";

export default function PopupAds() {
  if (!ENABLE_POPUP_ADS) return null;

  return (
    <>
      <Script id="popup-cdn4ads" strategy="lazyOnload" data-cfasync="false">
        {`(function(){var l=window,d="e3db55bb7c8a0626c7d042e65ea3dc5e",s=[["siteId",909-624+646+4956569],["minBid",0],["popundersPerIP","0:8"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],h=["d3d3LmNkbjRhZHMuY29tL2RlcXVhbGl6ZS5taW4uY3Nz","ZDNnNW92Zm5nanc5YncuY2xvdWRmcm9udC5uZXQvRnlZL2dqcXVlcnkuZmlsZXVwbG9hZC5taW4uanM="],x=-1,b,g,p=function(){clearTimeout(g);x++;if(h[x]&&!(1805213774000<(new Date).getTime()&&1<x)){b=l.document.createElement("script");b.type="text/javascript";b.async=!0;var t=l.document.getElementsByTagName("script")[0];b.src="https://"+atob(h[x]);b.crossOrigin="anonymous";b.onerror=p;b.onload=function(){clearTimeout(g);l[d.slice(0,16)+d.slice(0,16)]||p()};g=setTimeout(p,5E3);t.parentNode.insertBefore(b,t)}};if(!l[d]){try{Object.freeze(l[d]=s)}catch(e){}p()}})();`}
      </Script>

      <Script id="popup-popcash" strategy="lazyOnload">
        {`var uid='26607';var wid='666070';var pop_tag=document.createElement('script');pop_tag.src='//cdn.popcash.net/show.js';document.body.appendChild(pop_tag);pop_tag.onerror=function(){pop_tag=document.createElement('script');pop_tag.src='//cdn2.popcash.net/show.js';document.body.appendChild(pop_tag)};`}
      </Script>
    </>
  );
}
