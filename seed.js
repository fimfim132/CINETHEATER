var mongoose    = require('mongoose');
var Slide       = require('./models/slide');
var data =[
    {
        img: 'https://www.ktc.co.th/pub/media/Promotion/Book/cinema/092020-Airpay-majorcineplex-sfcinema-movie-ticket-promo-m.jpg'
    },
    {
        img: 'https://i.ytimg.com/vi/Xnzd75G-K_w/maxresdefault.jpg'
    },
    {
        img: 'https://2.bp.blogspot.com/-lhfpF2uQgjw/V324tQrNjcI/AAAAAAAAAdg/E2jr02bloNQ91c5n13Eiuc22_L_kcsWIwCLcB/s1600/GSC%2BCinemas%2BMovie%2BTicket%2BDiscount%2BPromotion.png'
    },
    {
        img: 'https://dineclub.adidocdn.dev/media/pages/August2020/53bfmlC1m1OoyeIka4k9.jpg'
    }
];

function seedDB(){
    Slide.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log('remove DB completed');
        data.forEach(function(seed){
            Slide.create(seed, function(err, slide){
                if(err){
                    console.log(err);
                } else {
                    console.log('new data add');
                }
            });
        });
    });
}

module.exports = seedDB;