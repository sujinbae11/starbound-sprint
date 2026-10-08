/** Shared text button used by menu and result scenes. */
function addTextButton(scene, x, y, label, onClick, options = {}) {
  const button = scene.add
    .text(x, y, label, {
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      fontSize: options.fontSize || '28px',
      color: options.color || '#ffffff',
      backgroundColor: options.backgroundColor || '#4b3fa6',
      padding: options.padding || { x: 24, y: 12 },
      stroke: '#16102f',
      strokeThickness: 3
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

  button.on('pointerover', () => button.setScale(1.05).setTint(0xfff1a8));
  button.on('pointerout', () => button.setScale(1).clearTint());
  button.on('pointerdown', onClick);
  return button;
}
