Add-Type -AssemblyName System.Drawing
$width = 1200
$height = 630
$bitmap = [System.Drawing.Bitmap]::new($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$bounds = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  $bounds,
  [System.Drawing.Color]::FromArgb(8, 13, 27),
  [System.Drawing.Color]::FromArgb(24, 45, 68),
  20
)
$graphics.FillRectangle($background, $bounds)

$random = [System.Random]::new(2026)
for ($i = 0; $i -lt 130; $i++) {
  $x = $random.Next(0, $width)
  $y = $random.Next(0, $height)
  $size = if ($i % 13 -eq 0) { 3 } else { 1 }
  $star = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($random.Next(85, 190), 219, 232, 255))
  $graphics.FillEllipse($star, $x, $y, $size, $size)
  $star.Dispose()
}

$ringPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(52, 171, 194, 230), 2)
$graphics.DrawEllipse($ringPen, 710, 10, 580, 580)
$graphics.DrawEllipse($ringPen, 790, 88, 420, 420)
$graphics.DrawEllipse($ringPen, 865, 163, 270, 270)

$points = @(
  @(@(786, 370), @(889, 270), @(1015, 312), @(1120, 206)),
  @(@(742, 475), @(858, 533), @(968, 453), @(1108, 500)),
  @(@(812, 150), @(916, 95), @(1032, 151), @(1147, 82))
)
$colors = @(
  [System.Drawing.Color]::FromArgb(184, 199, 255),
  [System.Drawing.Color]::FromArgb(241, 195, 155),
  [System.Drawing.Color]::FromArgb(165, 228, 214)
)
for ($line = 0; $line -lt 3; $line++) {
  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(115, $colors[$line]), 2)
  $dot = [System.Drawing.SolidBrush]::new($colors[$line])
  for ($point = 0; $point -lt $points[$line].Count; $point++) {
    $xy = $points[$line][$point]
    $graphics.FillEllipse($dot, $xy[0] - 5, $xy[1] - 5, 10, 10)
    if ($point -gt 0) {
      $prev = $points[$line][$point - 1]
      $graphics.DrawLine($pen, $prev[0], $prev[1], $xy[0], $xy[1])
    }
  }
  $pen.Dispose()
  $dot.Dispose()
}

$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(247, 246, 242))
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(185, 199, 230))
$fontTitle = [System.Drawing.Font]::new('Microsoft YaHei', 72, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontSubtitle = [System.Drawing.Font]::new('Microsoft YaHei', 25, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fontSmall = [System.Drawing.Font]::new('Consolas', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('AN INTERACTIVE MEMOIR', $fontSmall, $muted, 70, 105)
$graphics.DrawString('把世界', $fontTitle, $white, 63, 185)
$graphics.DrawString('重新编排', $fontTitle, $white, 63, 278)
$graphics.DrawString('未知  /  放手  /  成为', $fontSubtitle, $muted, 70, 430)
$graphics.DrawString('2017—2026 · THREE WAYS THROUGH ONE LIFE', $fontSmall, $muted, 70, 545)

$output = Join-Path $PSScriptRoot '..\stories\rearrange\assets\og.png'
$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$fontTitle.Dispose(); $fontSubtitle.Dispose(); $fontSmall.Dispose()
$white.Dispose(); $muted.Dispose(); $ringPen.Dispose(); $background.Dispose()
$graphics.Dispose(); $bitmap.Dispose()
Write-Output (Resolve-Path $output)
