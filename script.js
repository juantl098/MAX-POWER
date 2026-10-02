// Número de WhatsApp (sin + ni espacios). Cámbialo aquí si cambias de número.
const WHATSAPP_NUMBER = '573153250007'

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Íconos (librería Lucide)
lucide.createIcons()

// ---------- Menú móvil ----------
const menuToggle = document.getElementById('menuToggle')
const mobileMenu = document.getElementById('mobileMenu')

function setMenu(open) {
  mobileMenu.hidden = !open
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú')
  menuToggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`
  lucide.createIcons()
}

menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden))
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))

// ---------- Carrusel de promociones ----------
const track = document.getElementById('promoCarousel')
const slides = Array.from(track.querySelectorAll('.promo'))
const dotsBox = document.getElementById('promoDots')
const controls = document.querySelector('.carousel__controls')
let active = 0

slides.forEach((slide, i) => {
  const title = slide.querySelector('h3').textContent
  slide.setAttribute('aria-label', `${i + 1} de ${slides.length}: ${title}`)
  const dot = document.createElement('button')
  dot.type = 'button'
  dot.setAttribute('aria-label', `Ver ${title}`)
  dot.addEventListener('click', () => goTo(i))
  dotsBox.appendChild(dot)
})

function slidesPerView() {
  return Math.max(1, Math.round(track.clientWidth / slides[0].clientWidth))
}

function goTo(index) {
  const pages = slides.length - slidesPerView() + 1
  const target = (index + pages) % pages
  track.scrollTo({ left: slides[target].offsetLeft - track.offsetLeft, behavior: 'smooth' })
}

function updateDots() {
  const step = slides[0].clientWidth + 24
  active = Math.round(track.scrollLeft / step)
  const pages = slides.length - slidesPerView() + 1
  controls.hidden = pages <= 1
  dotsBox.querySelectorAll('button').forEach((dot, i) => {
    dot.hidden = i >= pages
    dot.setAttribute('aria-current', String(i === active))
  })
}

document.getElementById('promoPrev').addEventListener('click', () => goTo(active - 1))
document.getElementById('promoNext').addEventListener('click', () => goTo(active + 1))
track.addEventListener('scroll', updateDots)
window.addEventListener('resize', updateDots)
updateDots()

// ---------- Cotizador ----------
const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

const propertyGroup = document.getElementById('propertyOptions')
const pestGroup = document.getElementById('pestOptions')
const totalEl = document.getElementById('quoteTotal')
const quoteLink = document.getElementById('quoteLink')

function selected(group) {
  return group.querySelector('.option.is-active')
}

function updateQuote() {
  const property = selected(propertyGroup)
  const pest = selected(pestGroup)
  const total = Number(property.dataset.price) + Number(pest.dataset.price)
  totalEl.textContent = formatCOP(total)
  quoteLink.href = whatsappLink(
    `Hola, quiero cotizar un servicio.\n- Inmueble: ${property.dataset.label}\n- Plaga: ${pest.dataset.label}\n- Valor estimado: ${formatCOP(total)}`,
  )
}

;[propertyGroup, pestGroup].forEach((group) => {
  group.querySelectorAll('.option').forEach((option) => {
    option.addEventListener('click', () => {
      group.querySelectorAll('.option').forEach((o) => {
        o.classList.remove('is-active')
        o.setAttribute('aria-pressed', 'false')
      })
      option.classList.add('is-active')
      option.setAttribute('aria-pressed', 'true')
      updateQuote()
    })
  })
})
updateQuote()

// ---------- Formulario de contacto (envía a WhatsApp) ----------
document.getElementById('contactForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const message = `Hola, soy ${data.get('name')}.\nTeléfono: ${data.get('phone')}\n\n${data.get('message')}`
  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
})
