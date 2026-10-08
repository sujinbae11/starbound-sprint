param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$gameRoot = [System.IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path))
$listener = $null
$selectedPort = $null

foreach ($candidatePort in 8765..8775) {
  try {
    $candidate = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidatePort)
    $candidate.Start()
    $listener = $candidate
    $selectedPort = $candidatePort
    break
  } catch {
    if ($candidate) { $candidate.Stop() }
  }
}

if (-not $listener) {
  throw 'No available local port was found between 8765 and 8775.'
}

$gameUrl = "http://127.0.0.1:$selectedPort/"
Write-Host ''
Write-Host 'Starbound Sprint is running.' -ForegroundColor Cyan
Write-Host "Open: $gameUrl" -ForegroundColor Yellow
Write-Host 'Keep this window open while playing. Press Ctrl+C to stop.' -ForegroundColor Gray
Write-Host ''

if (-not $NoBrowser) {
  Start-Process $gameUrl
}

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.wav'  = 'audio/wav'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.json' = 'application/json; charset=utf-8'
  '.md'   = 'text/plain; charset=utf-8'
}

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

      while ($true) {
        $headerLine = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($headerLine)) { break }
      }

      $parts = $requestLine.Split(' ')
      if ($parts.Count -lt 2 -or $parts[0] -ne 'GET') {
        $status = '405 Method Not Allowed'
        $body = [System.Text.Encoding]::UTF8.GetBytes('Method Not Allowed')
        $contentType = 'text/plain; charset=utf-8'
      } else {
        $requestPath = $parts[1].Split('?')[0]
        if ($requestPath -eq '/') { $requestPath = '/index.html' }
        $relativePath = [System.Uri]::UnescapeDataString($requestPath.TrimStart('/')).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $fullPath = [System.IO.Path]::GetFullPath((Join-Path $gameRoot $relativePath))

        if (-not $fullPath.StartsWith($gameRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
          $status = '403 Forbidden'
          $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
          $contentType = 'text/plain; charset=utf-8'
        } elseif (Test-Path -LiteralPath $fullPath -PathType Leaf) {
          $status = '200 OK'
          $body = [System.IO.File]::ReadAllBytes($fullPath)
          $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
          $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { 'application/octet-stream' }
        } else {
          $status = '404 Not Found'
          $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
          $contentType = 'text/plain; charset=utf-8'
        }
      }

      $headers = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($body, 0, $body.Length)
      $stream.Flush()
    } catch {
      Write-Warning $_.Exception.Message
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
