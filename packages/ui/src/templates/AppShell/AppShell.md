# AppShell

`AppShell` is the structural template for dense, authenticated application
layouts.

## Use it for

- dashboards
- tools and internal apps
- workspace layouts with persistent navigation regions
- authenticated product surfaces with multiple persistent panels

## Do not use it for

- marketing pages
- docs pages
- blog/content pages
- simple page layouts without persistent workspace regions

Use `PageShell` for those cases.

## Regional responsibilities

- `header`: top application chrome, commonly where `Navbar` lives
- `navigation`: primary app movement (global or section navigation)
- `sidebar`: secondary workspace/supporting region
- `aside`: complementary context content
- `children`: main application content
- `footer`: optional app footer

`navigation`, `sidebar`, and `aside` are intentionally distinct regions.

## Navbar in header example

```tsx
<AppShell
  header={
    <Navbar>
      <Navbar.Container>
        <Navbar.Brand href="/">ThemeShift</Navbar.Brand>
      </Navbar.Container>
    </Navbar>
  }
>
  Main workspace
</AppShell>
```

## Persistent navigation and sidebar

```tsx
<AppShell
  header={<Navbar>...</Navbar>}
  navigation={<AppNavigation />}
  navigationMode="fixed"
  sidebar={<InspectorPanel />}
  sidebarMode="inline"
>
  Main workspace
</AppShell>
```

## Mobile overlay regions

```tsx
<AppShell
  defaultNavigationOpen={false}
  defaultSidebarOpen={false}
  navigation={<AppNavigation />}
  navigationMode="inline"
  navigationOverlayBelow="desktop"
  sidebar={<InspectorPanel />}
  sidebarMode="inline"
  sidebarOverlayBelow="desktop"
>
  Main workspace
</AppShell>
```

Below the selected breakpoint, those regions switch to overlay behavior and can
be opened and dismissed independently.

## Accessibility guidance

- A skip link always renders before visible shell content.
- `children` always render inside the main landmark.
- Navigation uses a `nav` landmark and supports `navLabel`.
- Sidebar renders as a labeled `section` landmark and supports `sidebarLabel`.
- Overlay regions are hidden from tab order when closed.
- Escape closes open overlays.
- Focus returns to the prior trigger when overlays close.
