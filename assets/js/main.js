(function () {
  "use strict";

  const hidePreloader = () => {
    const preloader = document.querySelector(".iv-preloader");
    if (!preloader || preloader.classList.contains("is-loaded")) return;
    preloader.classList.add("is-loaded");
    window.setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 400);
  };

  window.addEventListener("load", hidePreloader);
  window.setTimeout(hidePreloader, 2500);

  window.onscroll = function () {
    const iv_header = document.querySelector(".iv-header");
    const sticky = iv_header.offsetTop;
    const logo = document.querySelector(".navbar-brand img");
    const isDashboardPage = document.body.classList.contains("iv-dashboard-page");

    if (window.pageYOffset > sticky) {
      iv_header.classList.add("sticky");
    } else {
      iv_header.classList.remove("sticky");
    }

    if (iv_header.classList.contains("sticky") && !isDashboardPage) {
      logo.src = "assets/images/logo/logo-2.png";
    } else {
      logo.src = "assets/images/logo/logo.png";
    }

    const backToTop = document.querySelector(".back-to-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  };

  let navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const submenuItems = document.querySelectorAll(".nav-item-has-children");

  const closeAllSubmenus = () => {
    submenuItems.forEach((item) => {
      item.classList.remove("is-open");
      const submenu = item.querySelector(".iv-submenu");
      if (submenu) submenu.classList.remove("show");
    });
  };

  document.querySelectorAll(".iv-menu-scroll").forEach((e) =>
    e.addEventListener("click", () => {
      if (navbarToggler) navbarToggler.classList.remove("active");
      if (navbarCollapse) navbarCollapse.classList.remove("show");
      closeAllSubmenus();
    })
  );
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", function () {
      navbarToggler.classList.toggle("active");
      navbarCollapse.classList.toggle("show");
      if (!navbarCollapse.classList.contains("show")) closeAllSubmenus();
    });
  }

  submenuItems.forEach((item) => {
    const trigger = item.querySelector("a");
    const submenu = item.querySelector(".iv-submenu");
    if (!trigger || !submenu) return;

    trigger.addEventListener("click", (event) => {
      const isMobileMenu = window.innerWidth < 992;

      if (isMobileMenu) {
        event.preventDefault();
        const shouldOpen = !item.classList.contains("is-open");

        submenuItems.forEach((otherItem) => {
          if (otherItem === item) return;
          otherItem.classList.remove("is-open");
          const otherSubmenu = otherItem.querySelector(".iv-submenu");
          if (otherSubmenu) otherSubmenu.classList.remove("show");
        });

        item.classList.toggle("is-open", shouldOpen);
        submenu.classList.toggle("show", shouldOpen);
        return;
      }

      const shouldOpen = !item.classList.contains("is-open");
      submenuItems.forEach((otherItem) => otherItem.classList.remove("is-open"));
      item.classList.toggle("is-open", shouldOpen);
    });

    item.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 992) item.classList.add("is-open");
    });

    item.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 992) item.classList.remove("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth < 992) return;
    if (!event.target.closest(".nav-item-has-children")) closeAllSubmenus();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      submenuItems.forEach((item) => {
        const submenu = item.querySelector(".iv-submenu");
        if (submenu) submenu.classList.remove("show");
      });
    } else {
      submenuItems.forEach((item) => item.classList.remove("is-open"));
    }
  });

  const initDashboardSidebarDrawer = () => {
    if (!document.body.classList.contains("iv-dashboard-page")) return;

    const sidebar = document.querySelector(".iv-dashboard-sidebar");
    if (!sidebar) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "iv-dashboard-menu-toggle";
    toggleBtn.setAttribute("aria-label", "Open dashboard menu");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.innerHTML = '<i class="lni lni-menu"></i><span>Menu</span>';

    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "iv-dashboard-sidebar-backdrop";
    backdrop.setAttribute("aria-label", "Close dashboard menu");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "iv-dashboard-sidebar-close";
    closeBtn.setAttribute("aria-label", "Close dashboard menu");
    closeBtn.innerHTML = '<i class="lni lni-close"></i>';

    sidebar.insertBefore(closeBtn, sidebar.firstChild);
    document.body.appendChild(backdrop);
    document.body.appendChild(toggleBtn);

    const closeDrawer = () => {
      document.body.classList.remove("iv-sidebar-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    };

    const openDrawer = () => {
      document.body.classList.add("iv-sidebar-open");
      toggleBtn.setAttribute("aria-expanded", "true");
    };

    toggleBtn.addEventListener("click", () => {
      if (document.body.classList.contains("iv-sidebar-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    closeBtn.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    sidebar.querySelectorAll(".iv-dashboard-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) closeDrawer();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer();
    });

    const desktopQuery = window.matchMedia("(min-width: 992px)");
    const handleDesktopChange = (event) => {
      if (event.matches) closeDrawer();
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktopChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleDesktopChange);
    }
  };
  initDashboardSidebarDrawer();

  const initProfilePhotoUpload = () => {
    if (!document.body.classList.contains("iv-profile-page")) return;

    const fileInput = document.getElementById("profilePhotoInput");
    const dropzone = document.getElementById("profilePhotoDropzone");
    const previewImage = document.getElementById("profilePhotoPreview");
    const removeButton = document.getElementById("profilePhotoRemoveBtn");
    const feedback = document.getElementById("profilePhotoFeedback");
    const sidebarAvatar = document.getElementById("profileSidebarAvatar");

    if (!fileInput || !previewImage || !removeButton || !feedback) return;

    const defaultPreviewSrc = previewImage.getAttribute("src") || "";
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const maxFileSize = 2 * 1024 * 1024;

    const setFeedback = (message, state) => {
      feedback.textContent = message;
      feedback.classList.remove("is-success", "is-error");
      if (state) feedback.classList.add(state);
    };

    const setSidebarAvatarImage = (src) => {
      if (!sidebarAvatar) return;
      const avatarImage = document.createElement("img");
      avatarImage.src = src;
      avatarImage.alt = "Profile photo";
      sidebarAvatar.innerHTML = "";
      sidebarAvatar.appendChild(avatarImage);
      sidebarAvatar.classList.add("has-photo");
    };

    const resetSidebarAvatar = () => {
      if (!sidebarAvatar) return;
      const initials = sidebarAvatar.getAttribute("data-initials") || "US";
      sidebarAvatar.classList.remove("has-photo");
      sidebarAvatar.textContent = initials;
    };

    const applyProfilePhoto = (file) => {
      if (!file) return;

      if (!allowedTypes.has(file.type)) {
        setFeedback("Only JPG, PNG, or WEBP files are allowed.", "is-error");
        fileInput.value = "";
        return;
      }

      if (file.size > maxFileSize) {
        setFeedback("File is too large. Maximum allowed size is 2 MB.", "is-error");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target && typeof event.target.result === "string"
          ? event.target.result
          : "";
        if (!result) {
          setFeedback("Unable to preview this image. Try another file.", "is-error");
          return;
        }

        previewImage.src = result;
        setSidebarAvatarImage(result);
        setFeedback("Profile photo ready to save.", "is-success");
      };
      reader.readAsDataURL(file);
    };

    fileInput.addEventListener("change", () => {
      const selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
      applyProfilePhoto(selectedFile);
    });

    removeButton.addEventListener("click", () => {
      fileInput.value = "";
      previewImage.src = defaultPreviewSrc;
      if (defaultPreviewSrc) {
        setSidebarAvatarImage(defaultPreviewSrc);
      } else {
        resetSidebarAvatar();
      }
      setFeedback("Photo removed. Default image restored.", "is-success");
    });

    if (defaultPreviewSrc) {
      setSidebarAvatarImage(defaultPreviewSrc);
    } else {
      resetSidebarAvatar();
    }

    if (dropzone) {
      const addDropzoneState = (event) => {
        event.preventDefault();
        dropzone.classList.add("is-dragover");
      };

      const clearDropzoneState = (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragover");
      };

      dropzone.addEventListener("dragenter", addDropzoneState);
      dropzone.addEventListener("dragover", addDropzoneState);
      dropzone.addEventListener("dragleave", clearDropzoneState);
      dropzone.addEventListener("drop", (event) => {
        clearDropzoneState(event);
        const droppedFile = event.dataTransfer && event.dataTransfer.files
          ? event.dataTransfer.files[0]
          : null;
        applyProfilePhoto(droppedFile);
      });
    }
  };
  initProfilePhotoUpload();

  new WOW().init();

  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;

      const val = Math.easeInOutQuad(currentTime, start, change, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  document.querySelector(".back-to-top").onclick = () => {
    scrollTo(document.documentElement);
  };
})();
