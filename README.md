# scrum-poker

>  Scrum poker project

## Build Setup

``` bash

scrum poker 3 ayrı sayfadan oluşmaktadır
1) İlk başta yeni oturum açmak için oturum adı ,bütün developerların isimlerini kayıt etmek için bir form ve oylanacak storylerin girileceği bir text box bulunuyor.
2) Scrum master ilk ekranı doldurduğunda Start session butonuna basınca router ile bizi scrum master sayfasına yönlendiriyor.Burada active olan storyler için hem scrum masterın kendisi oy verebiliyor hem de katılım sağlayan developerların oylama sayfasına ulaşabilieceği bir link bulunuyor. Bu link kopyalandığında projenin 3. sayfası olan  view planing developer sayfasına ulaşabiliyoruz.
3) Developer Oylama sayfasına giriş yapabilmek için öncelikle session başlatılırken girilen developer isimleri ile birebir uyumlu olması gerekiyor. İsmi uyumlu developerlar bu sayfada oylarını gönderiyor  ve herkes oy verdiğinde hem scrum master ekrarına hem de developer ekranına active storynin bütün puanları gözüküyor 

sonunda scrum master bütün oylamalar sonucunda final score girdiğinde active story başarılı bir şekilde oylanıyor ve diğer story activeleşiyor.

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


