/* ===================================================
   ENQUIRY FORM + REVIEW SYSTEM -> FIREBASE FIRESTORE
=================================================== */

import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

  // ── ENQUIRY FORM ──
  const form = document.getElementById('enquiry-form');
  const status = document.getElementById('enquiry-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalText = btn.textContent;
      const data = {
        fullName: form.fullName.value.trim(),
        mobile: form.mobile.value.trim(),
        city: form.city.value.trim(),
        installationType: form.installationType.value,
        monthlyBill: form.monthlyBill.value.trim(),
        roofArea: form.roofArea.value.trim(),
        message: form.message.value.trim(),
        createdAt: serverTimestamp(),
        status: "new"
      };
      if (!data.fullName || !data.mobile) {
        if (status) { status.textContent = 'Please enter your name and mobile number.'; status.className = 'form-status error'; }
        return;
      }
      btn.disabled = true; btn.textContent = 'Sending...';
      if (status) { status.textContent = ''; status.className = 'form-status'; }
      try {
        await addDoc(collection(db, 'enquiries'), data);
        btn.textContent = '✓ Sent! We\'ll contact you shortly.';
        btn.style.background = 'var(--gold)';
        if (status) { status.textContent = 'Thank you! Pritam Patil will call you back soon.'; status.className = 'form-status success'; }
        setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; form.reset(); if (status) { status.textContent = ''; status.className = 'form-status'; } }, 4000);
      } catch (err) {
        console.error('Firebase error:', err);
        btn.textContent = originalText; btn.disabled = false;
        if (status) { status.textContent = 'Something went wrong. Please call us directly or try again.'; status.className = 'form-status error'; }
      }
    });
  }

  // ── STAR RATING INPUT ──
  const starInput = document.getElementById('star-input');
  const ratingField = document.getElementById('reviewRating');
  if (starInput) {
    const stars = starInput.querySelectorAll('span');
    let selectedRating = 5;
    // highlight all 5 by default
    stars.forEach(s => s.classList.add('active'));
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const val = parseInt(star.dataset.val);
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
      });
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.val);
        ratingField.value = selectedRating;
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
      });
    });
  }

  // ── LOAD REVIEWS ──
  async function loadReviews() {
    const listEl = document.getElementById('reviews-list');
    const loadingEl = document.getElementById('reviews-loading');
    if (!listEl) return;
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) {
        if (loadingEl) loadingEl.textContent = 'No reviews yet — be the first to share your experience!';
        return;
      }
      if (loadingEl) loadingEl.remove();
      snap.forEach(doc => {
        const d = doc.data();
        const stars = '★'.repeat(d.rating || 5) + '☆'.repeat(5 - (d.rating || 5));
        const initial = (d.name || 'A')[0].toUpperCase();
        const date = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) : '';
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
          <div class="stars">${stars}</div>
          <p class="review-text">"${d.review}"</p>
          <div class="review-author">
            <div class="author-avatar">${initial}</div>
            <div>
              <div class="author-name">${d.name}</div>
              <div class="author-location">${d.city || ''}</div>
              <div class="review-date">${date}</div>
            </div>
          </div>`;
        listEl.appendChild(card);
      });
    } catch (err) {
      console.error('Error loading reviews:', err);
      if (loadingEl) loadingEl.textContent = 'Could not load reviews. Please check your Firebase config.';
    }
  }
  loadReviews();

  // ── SUBMIT REVIEW ──
  const reviewForm = document.getElementById('review-form');
  const reviewStatus = document.getElementById('review-status');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = reviewForm.querySelector('.form-submit');
      const originalText = btn.textContent;
      const data = {
        name: reviewForm.reviewName.value.trim(),
        city: reviewForm.reviewCity.value.trim(),
        rating: parseInt(reviewForm.reviewRating.value) || 5,
        review: reviewForm.reviewText.value.trim(),
        createdAt: serverTimestamp()
      };
      if (!data.name || !data.review) {
        if (reviewStatus) { reviewStatus.textContent = 'Please enter your name and review.'; reviewStatus.className = 'form-status error'; }
        return;
      }
      btn.disabled = true; btn.textContent = 'Posting...';
      try {
        await addDoc(collection(db, 'reviews'), data);
        btn.textContent = '✓ Review posted! Thank you.';
        btn.style.background = 'var(--gold)';
        if (reviewStatus) { reviewStatus.textContent = 'Your review has been submitted successfully!'; reviewStatus.className = 'form-status success'; }
        // Add card instantly without reload
        const listEl = document.getElementById('reviews-list');
        const loadingEl = document.getElementById('reviews-loading');
        if (loadingEl) loadingEl.remove();
        const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.borderColor = 'var(--gold)';
        card.innerHTML = `
          <div class="stars">${stars}</div>
          <p class="review-text">"${data.review}"</p>
          <div class="review-author">
            <div class="author-avatar">${data.name[0].toUpperCase()}</div>
            <div>
              <div class="author-name">${data.name}</div>
              <div class="author-location">${data.city}</div>
              <div class="review-date">Just now</div>
            </div>
          </div>`;
        listEl.prepend(card);
        setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; reviewForm.reset(); document.getElementById('star-input').querySelectorAll('span').forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= 5)); document.getElementById('reviewRating').value = 5; if (reviewStatus) { reviewStatus.textContent = ''; reviewStatus.className = 'form-status'; } }, 4000);
      } catch (err) {
        console.error('Review error:', err);
        btn.textContent = originalText; btn.disabled = false;
        if (reviewStatus) { reviewStatus.textContent = 'Could not post review. Please try again.'; reviewStatus.className = 'form-status error'; }
      }
    });
  }

});
