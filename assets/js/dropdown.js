        document.addEventListener("DOMContentLoaded", function() {
            const dropdownBtn = document.querySelector(".dropdown-btn");
            const dropdownMenu = document.querySelector(".dropdown-menu");
            const sizeOptions = document.querySelectorAll(".dropdown-menu li");
            
            dropdownBtn.addEventListener("click", function() {
                dropdownMenu.classList.toggle("show");
            });
            
            sizeOptions.forEach(option => {
                option.addEventListener("click", function() {
                    dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
                    dropdownMenu.classList.remove("show");
                });
            });
            
            document.addEventListener("click", function(event) {
                if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                    dropdownMenu.classList.remove("show");
                }
            });
        });