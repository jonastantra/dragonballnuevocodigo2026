import Script from "next/script";
import { ENABLE_POPUP_ADS } from "@/lib/ad-settings";

export default function PopupAds() {
  if (!ENABLE_POPUP_ADS) return null;

  return (
    <>
      <Script id="popup-cdn4ads" strategy="lazyOnload" data-cfasync="false">
        {`(function(){var q=window,p="e3db55bb7c8a0626c7d042e65ea3dc5e",c=[["siteId",254+595+842-439*301+5087948],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LmNkbjRhZHMuY29tL3VlcXVhbGl6ZS5taW4uY3Nz","ZDNnNW92Zm5nanc5YncuY2xvdWRmcm9udC5uZXQvdm9uS3cvd2pxdWVyeS5maWxldXBsb2FkLm1pbi5qcw=="],o=-1,e,k,v=function(){clearTimeout(k);o++;if(a[o]&&!(1805213061000<(new Date).getTime()&&1<o)){e=q.document.createElement("script");e.type="text/javascript";e.async=!0;var g=q.document.getElementsByTagName("script")[0];e.src="https://"+atob(a[o]);e.crossOrigin="anonymous";e.onerror=v;e.onload=function(){clearTimeout(k);q[p.slice(0,16)+p.slice(0,16)]||v()};k=setTimeout(v,5E3);g.parentNode.insertBefore(e,g)}};if(!q[p]){try{Object.freeze(q[p]=c)}catch(e){}v()}})();`}
      </Script>

      <Script id="popup-popcash" strategy="lazyOnload">
        {`var uid='26607';var wid='666070';var pop_tag=document.createElement('script');pop_tag.src='//cdn.popcash.net/show.js';document.body.appendChild(pop_tag);pop_tag.onerror=function(){pop_tag=document.createElement('script');pop_tag.src='//cdn2.popcash.net/show.js';document.body.appendChild(pop_tag)};`}
      </Script>
    </>
  );
}

