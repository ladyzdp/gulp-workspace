require.config({　　　
    paths: {
        jquery: "jquery.min",
        public: "public"
    }
    // shim: {
    //     public: {
    //         exports: "talk"
    //     }
    // }
});


require(['public'], function(test) {
  talk();
  test.hello();
});
