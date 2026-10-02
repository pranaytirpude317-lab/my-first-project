// Mobile navigation toggle
const navToggle = document.getElementById("navToggle")
const navMenu = document.getElementById("navMenu")

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open")
    navToggle.setAttribute("aria-expanded", String(open))
  })

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open")
      navToggle.setAttribute("aria-expanded", "false")
    })
  })
}

// Contact form (client-side demo handling)
const form = document.getElementById("contactForm")
const status = document.getElementById("formStatus")

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    if (!form.checkValidity()) {
      status.textContent = "Please fill in all required fields."
      return
    }
    const data = new FormData(form)
    status.textContent = `Thanks, ${data.get("name")}! We'll be in touch soon.`
    form.reset()
  })
}

// Dynamic footer year
const yearEl = document.getElementById("year")
if (yearEl) {
  yearEl.textContent = new Date().getFullYear()
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Condense the header once the page is scrolled
const header = document.querySelector(".site-header")
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20)
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
}

// Count-up animation for the hero stats
function countUp(el) {
  const target = Number(el.dataset.count || "0")
  const suffix = el.dataset.suffix || ""
  if (reduceMotion || !target) {
    el.textContent = target.toLocaleString() + suffix
    return
  }
  const duration = 1600
  const start = performance.now()
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(target * eased).toLocaleString() + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Scroll-reveal: fade + rise elements as they enter the viewport
const revealTargets = document.querySelectorAll(
  ".section-head, .service-card, .trainer-card, .plan-card, .contact-info, .contact-form"
)
revealTargets.forEach((el) => el.classList.add("reveal"))

// Stagger cards within each grid for a cascading effect
document.querySelectorAll(".grid").forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${Math.min(i * 90, 450)}ms`
  })
})

if (reduceMotion) {
  revealTargets.forEach((el) => el.classList.add("in"))
  document.querySelectorAll("[data-count]").forEach(countUp)
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("in")
        obs.unobserve(entry.target)
      })
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  )
  revealTargets.forEach((el) => observer.observe(el))

  const statsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.querySelectorAll("[data-count]").forEach(countUp)
        obs.unobserve(entry.target)
      })
    },
    { threshold: 0.5 }
  )
  const heroStats = document.querySelector(".hero-stats")
  if (heroStats) statsObserver.observe(heroStats)
}
