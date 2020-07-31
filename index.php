<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <base href="/">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>Pages</title>
        <!-- css  -->
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.css">
        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="node_modules/bootstrap-iconpicker/dist/css/bootstrap-iconpicker.min.css">
        <link rel="stylesheet" href="rnct-dist/css/rnct-admin-module.css">
        <script src="node_modules/jquery/jquery.js"></script>
        <script src="node_modules/popper.js/dist/umd/popper.js"></script>
        <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="node_modules/bootstrap-iconpicker/dist/js/bootstrap-iconpicker.bundle.min.js"></script>
        <script src="rnct-dist/js/rnct-admin-module.js"></script>
        <script src="dist/js/rnct-page-manager.js"></script>
    </head>
    <body>
        <button type="button" class="btn btn-secondary" id="trigger">Show</button>
        <div id="wrapper"></div>
        <script>
            var x = new RnctPages('#wrapper',{
                trigger: "#trigger",
                asPanel: true
            });
        </script>
    </body>
</html>
