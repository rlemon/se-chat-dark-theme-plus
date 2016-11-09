const mentionColorSheet = document.createElement('style');
document.head.appendChild(mentionColorSheet);
mentionColorSheet.textContent = `.mention{background-color: ${options.mention_color} !important;}`;