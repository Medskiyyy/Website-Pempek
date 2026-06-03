$webPages = @('/','/produk','/galeri','/testimoni','/kontak','/tentang')
$adminPages = @('/login','/dashboard','/products','/banners','/gallery','/testimonials','/settings','/users')

foreach ($p in $webPages) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 15
        Write-Host "WEB $p -> $($r.StatusCode)"
    } catch {
        Write-Host "WEB $p -> ERROR: $($_.Exception.Message)"
    }
}

foreach ($p in $adminPages) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3001$p" -UseBasicParsing -TimeoutSec 15
        Write-Host "ADMIN $p -> $($r.StatusCode)"
    } catch {
        Write-Host "ADMIN $p -> ERROR: $($_.Exception.Message)"
    }
}
