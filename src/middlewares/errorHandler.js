// Merkezi hata yakalayıcı: beklenmeyen hatalarda uygulamanın çökmesini önler.
module.exports = (err, req, res, next) => {
  // Bozuk JSON gövdesi
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Geçersiz JSON gövdesi.' });
  }
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Sunucu hatası' });
};
