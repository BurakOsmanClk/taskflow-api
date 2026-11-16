// Tanımlı olmayan bir endpoint'e gelen istekler için 404 yanıtı
module.exports = (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}` });
};
