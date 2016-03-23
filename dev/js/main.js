require.config({　　　
    paths: {
        jquery: "jquery.min",
        public: "public"
    },
    shim: {
        public: {
            exports: "talk"
        }
    }
});


require(['public'], function(test) {
    // talk();
    // test.hello();


    f();
});

function a() {

    var x = 1,
        y = 2;
    return function b() {
        console.log(x + y);
    }

}
var f = a();
