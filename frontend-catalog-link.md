# Frontend Catalog Linking - Implementation Plan

This plan describes the user interface updates to tightly connect authors (Rightsholders) to their compositions (Musical Works) in the React dashboard.

## Overview

Currently, the Rightsholders list and Musical Works list are disconnected. To improve the user experience:
1. **Author Portfolio**: We will implement a visual details modal/drawer that displays when clicking on a rightsholder, showcasing all the works they have splits in, their role, and their split shares.
2. **Co-writer Shares in Table**: We will add an "Authors & Splits" column directly to the Musical Works table, listing the composers and their mechanical/performance split percentages.

---

## Success Criteria

1. **Table Column Integration**: The Musical Works table displays badges for each rightsholder with their split shares (e.g., `Gilberto Gil (50.00%)`).
2. **Interactive Details Panel**: Clicking on a rightsholder row in the Registry opens a details modal displaying their metadata and their complete catalog of works (role, split sheets, and status).
3. **Premium Theme Consistency**: The new elements strictly use the premium dark glassmorphic design system and avoid forbidden colors (no purple/violet).
4. **Clean Build**: Both backend and frontend continue to compile with zero warnings or errors.

---

## Proposed Changes

### [MODIFY] [frontend/src/App.jsx](file:///d:/Projetos/iswc/frontend/src/App.jsx)
We will modify the React application state and layout structure:
- **Add Portfolio State**: `selectedAuthorPortfolio` to track which rightsholder's portfolio is currently open in the details modal.
- **Update Works List Layout**: Fetch and merge rightsholders details inline for the main works grid.
- **Add Detail Drawer Component**: Build a details view listing the works associated with the selected rightsholder.
- **Enhance Table Grid**: Add the "Authors & Shares" column displaying writer splits.

---

## Task Breakdown

### Phase 1: Interactive UI Updates (Priority: P0)
- **Task 1.1**: Update the Musical Works table to fetch and display composer/cota shares inline.
  - **Agent**: `frontend-specialist`
  - **Skill**: `react-best-practices`
  - **INPUT**: `works` API response containing splits data.
  - **OUTPUT**: Expanded column in works table in `App.jsx`.
  - **VERIFY**: Open Works Catalog tab and verify that "Tropicália" shows `Caetano Veloso (50%)` and `Gilberto Gil (50%)` in a dedicated column.
- **Task 1.2**: Implement the Author Portfolio Modal.
  - **Agent**: `frontend-specialist`
  - **Skill**: `frontend-design`
  - **INPUT**: Selected rightsholder ID.
  - **OUTPUT**: A details panel popup in `App.jsx` listing all matching works from `works` state.
  - **VERIFY**: Open Rightsholders tab, click on "Gilberto Gil", verify modal opens listing *"Aquele Abraço" (100.0%)*, *"Tropicália" (50.0%)*, and *"Cálice" (40.0%)*.
- **Task 1.3**: Clean up and style details with premium CSS classes.
  - **Agent**: `frontend-specialist`
  - **Skill**: `clean-code`
  - **INPUT**: `index.css` classes.
  - **OUTPUT**: Glassmorphic styling on the new drawer modal.
  - **VERIFY**: Verify layout adapts to dark background seamlessly.

---

## Verification Plan

### Automated Tests
- Build Frontend: `npm run build` inside `frontend/`
- Run UX Check: `python .agent/skills/frontend-design/scripts/ux_audit.py .`

### Manual Verification
- Refresh dashboard, click through composers, and verify portfolios load correct associated works.
