
export const setCookie = (cname, cvalue, exdays=0)=>{
  let expires = ''
  if(exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    expires = `expires=${d.toUTCString()}`;
  }
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export const getCookie = (cname)=>{
  const name = cname.concat("=");
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i+=1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const eraseCookie = (name)=>{
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}