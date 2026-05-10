$outDir = "c:\Users\ninja\OneDrive\Desktop\BeyBladeX King\public\parts"
$W = "https://static.wikia.nocookie.net/beyblade/images"

# Verified URLs from wiki
$images = @{
  "dran-sword"     = "$W/5/5f/BladeDranSword.png/revision/latest"
  "shark-edge"     = "$W/2/2e/BladeSharkEdge.png/revision/latest"
  "wizard-rod"     = "$W/a/a3/BladeWizardRod.png/revision/latest"
  "cobalt-dragoon" = "$W/c/c2/BladeCobaltDragoon.png/revision/latest"
  "shark-scale"    = "$W/e/e0/BladeSharkScale.png/revision/latest"
  "knight-shield"  = "$W/9/9c/BladeKnightShield.png/revision/latest"
  "hells-scythe"   = "$W/e/e4/BladeHellsScythe.png/revision/latest"
  "wizard-arrow"   = "$W/a/a4/BladeWizardArrow.png/revision/latest"
  "dran-buster-ux" = "$W/b/bc/BladeDranBuster.png/revision/latest"
  "hells-hammer-ux"= "$W/0/05/BladeHellsHammer.png/revision/latest"
  "phoenix-wing"   = "$W/6/6e/BladePhoenixWing.png/revision/latest"
  "leon-claw"      = "$W/4/4a/BladeLeonClaw.png/revision/latest"
  "viper-tail"     = "$W/f/f2/BladeViperTail.png/revision/latest"
  "cobalt-drake"   = "$W/3/3c/BladeCobaltDrake.png/revision/latest"
  "meteor-dragoon" = "$W/d/d0/BladeMeteorDragoon.png/revision/latest"
  "hover-wyvern"   = "$W/8/88/BladeHoverWyvern.png/revision/latest"
  "impact-drake"   = "$W/a/a0/BladeImpactDrake.png/revision/latest"
  "aero-pegasus"   = "$W/8/8a/BladeAeroPegasus.png/revision/latest"
  "silver-wolf"    = "$W/0/0e/BladeSilverWolf.png/revision/latest"
  "shinobi-shadow" = "$W/0/05/BladeShinobiShadow.png/revision/latest"
  "phoenix-rudder" = "$W/2/20/BladePhoenixRudder.png/revision/latest"
  "leon-crest"     = "$W/6/67/BladeLeonCrest.png/revision/latest"
  "knight-mail"    = "$W/2/2c/BladeKnightMail.png/revision/latest"
  "samurai-saber"  = "$W/1/18/BladeSamuraiSaber.png/revision/latest"
  "tyranno-beat"   = "$W/3/3e/BladeTyrannoBeat.png/revision/latest"
  "hells-chain"    = "$W/e/eb/BladeHellsChain.png/revision/latest"
  "wyvern-gale"    = "$W/a/ab/BladeWyvernGale.png/revision/latest"
  "unicorn-sting"  = "$W/0/0a/BladeUnicornSting.png/revision/latest"
  "sphinx-cowl"    = "$W/9/96/BladeSphinxCowl.png/revision/latest"
  "ghost-circle"   = "$W/7/7e/BladeGhostCircle.png/revision/latest"
  "golem-rock"     = "$W/9/92/BladeGolemRock.png/revision/latest"
  "scorpio-spear"  = "$W/5/59/BladeScorpioSpear.png/revision/latest"
  "clock-mirage"   = "$W/3/34/BladeClockMirage.png/revision/latest"
  "bullet-griffon" = "$W/0/03/BladeBulletGriffon.png/revision/latest"
  "mummy-curse"    = "$W/6/69/BladeMummyCurse.png/revision/latest"
  # BITS
  "b-ball"         = "$W/8/8c/BitBall.png/revision/latest"
  "b-rush"         = "$W/e/e1/BitRush.png/revision/latest"
  "b-flat"         = "$W/b/b0/BitFlat.png/revision/latest"
  "b-low-rush"     = "$W/e/ef/BitLowRush.png/revision/latest"
  "b-hexa"         = "$W/4/46/BitHexa.png/revision/latest"
  "b-elevate"      = "$W/1/1d/BitElevate.png/revision/latest"
  "b-level"        = "$W/1/1b/BitLevel.png/revision/latest"
  "b-kick"         = "$W/5/5d/BitKick.png/revision/latest"
  "b-glide"        = "$W/c/cf/BitGlide.png/revision/latest"
  "b-free-ball"    = "$W/f/f6/BitFreeBall.png/revision/latest"
  "b-needle"       = "$W/5/5a/BitNeedle.png/revision/latest"
  "b-taper"        = "$W/7/7f/BitTaper.png/revision/latest"
  "b-spike"        = "$W/7/77/BitSpike.png/revision/latest"
  "b-point"        = "$W/b/bd/BitPoint.png/revision/latest"
  "b-accel"        = "$W/5/56/BitAccel.png/revision/latest"
  "b-unite"        = "$W/d/df/BitUnite.png/revision/latest"
  "b-metal-needle" = "$W/e/e2/BitMetalNeedle.png/revision/latest"
  "b-rubber-accel" = "$W/7/71/BitRubberAccel.png/revision/latest"
  "b-gear-flat"    = "$W/c/c2/BitGearFlat.png/revision/latest"
  "b-high-taper"   = "$W/3/38/BitHighTaper.png/revision/latest"
  "b-bound-spike"  = "$W/1/1b/BitBoundSpike.png/revision/latest"
  "b-dot"          = "$W/5/5a/BitDot.png/revision/latest"
  "b-orb"          = "$W/e/e3/BitOrb.png/revision/latest"
  "b-wedge"        = "$W/5/5d/BitWedge.png/revision/latest"
  "b-trans-kick"   = "$W/4/46/BitTransKick.png/revision/latest"
  "b-gear-rush"    = "$W/5/50/BitGearRush.png/revision/latest"
  "b-gear-ball"    = "$W/2/2c/BitGearBall.png/revision/latest"
  "b-disc-ball"    = "$W/1/18/BitDiscBall.png/revision/latest"
  "b-low-flat"     = "$W/6/6f/BitLowFlat.png/revision/latest"
  "b-gear-needle"  = "$W/b/b2/BitGearNeedle.png/revision/latest"
  "b-gear-point"   = "$W/2/27/BitGearPoint.png/revision/latest"
  "b-cyclone"      = "$W/d/d3/BitCyclone.png/revision/latest"
  "b-jolt"         = "$W/5/5b/BitJolt.png/revision/latest"
  "b-quake"        = "$W/3/30/BitQuake.png/revision/latest"
  "b-zap"          = "$W/c/c1/BitZap.png/revision/latest"
  # RATCHETS
  "r-3-60"         = "$W/1/1b/Ratchet3-60.png/revision/latest"
  "r-4-60"         = "$W/3/3c/Ratchet4-60.png/revision/latest"
  "r-1-60"         = "$W/0/0c/Ratchet1-60.png/revision/latest"
  "r-9-60"         = "$W/7/7c/Ratchet9-60.png/revision/latest"
  "r-5-60"         = "$W/0/05/Ratchet5-60.png/revision/latest"
}

$ok = 0; $fail = 0
foreach ($kv in $images.GetEnumerator()) {
  $file = Join-Path $outDir "$($kv.Key).png"
  if (Test-Path $file) {
    $size = (Get-Item $file).Length
    if ($size -gt 1000) { $ok++; Write-Host "SKIP (exists): $($kv.Key)"; continue }
  }
  try {
    Invoke-WebRequest -Uri $kv.Value -OutFile $file -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
    $size = (Get-Item $file).Length
    if ($size -gt 1000) { $ok++; Write-Host "OK ($size bytes): $($kv.Key)" }
    else { $fail++; Remove-Item $file; Write-Host "FAIL (too small): $($kv.Key)" }
  } catch {
    $fail++
    Write-Host "FAIL: $($kv.Key) - $($_.Exception.Message)"
  }
}
Write-Host "`nDone: $ok ok, $fail failed"
