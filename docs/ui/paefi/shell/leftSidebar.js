// ui/paefi/shell/leftSidebar.js

export const LeftSidebar = {
  init
};

function init(containerID) {
  const $sidebar = $(`
    <aside id="leftSidebar" class="left-sidebar">
      <div class="accordion" id="leftSidebarAccordion">

        <!-- Navigation -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ls-nav">
              Navegação
            </button>
          </h2>
          <div id="ls-nav" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <ul class="sidebar-list">
                <li class="text-muted">[em breve]</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ls-prefs">
              Preferências
            </button>
          </h2>
          <div id="ls-prefs" class="accordion-collapse collapse">
            <div class="accordion-body">
              <span class="text-muted">[em breve]</span>
            </div>
          </div>
        </div>

        <!-- Documentation -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ls-docs">
              Documentação
            </button>
          </h2>
          <div id="ls-docs" class="accordion-collapse collapse">
            <div class="accordion-body">
              <span class="text-muted">[em breve]</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  `);
  $(containerID).prepend($sidebar);
}
