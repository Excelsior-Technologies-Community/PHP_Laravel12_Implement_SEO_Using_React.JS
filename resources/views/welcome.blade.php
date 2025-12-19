<!DOCTYPE html>
<html lang="en">
<head>
   <!-- 🔹 BASIC META -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- 🔹 SEO FROM DATABASE -->
   <title>{{ $seo_title ?? 'Laravel 12 React' }}</title>

<meta name="description"
      content="{{ $seo_description ?? '' }}">

<meta name="keywords"
      content="{{ $seo_keywords ?? '' }}">

<link rel="canonical"
      href="{{ $seo_canonical ?? url()->current() }}">

<meta property="og:title"
      content="{{ $og_title ?? '' }}">

<meta property="og:description"
      content="{{ $og_description ?? '' }}">

<meta property="og:keywords"
      content="{{ $og_keywords ?? '' }}">

<meta property="og:type" content="product">

<meta property="og:url"
      content="{{ url()->current() }}">

<meta property="og:image"
      content="{{ $og_image ?? asset('images/default-og.png') }}">

    <!-- 🔹 Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- 🔹 VITE -->
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>

    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
