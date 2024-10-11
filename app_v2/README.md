# Sea Ice Information Service (SIIS) 

The Sea Ice Information Service (SIIS) provides up-to-date sea ice information products for decision making and route
planning when the RRS SDA is in, near or close to, sea ice in Antarctica and the Arctic

### Quick Start
To set up the project locally, follow these steps:

```shell
npm install
npm run dev
```

It is possible to view the design system via the panda studio command:

```shell
npm run studio
```

### About This Codebase
SIIS is built using modern web technologies to ensure performance, scalability, and ease of maintenance:
- `React`: Frontend framework, aligning with other applications such as ILP.
- `Vite`: For fast and efficient development and building.
- `Panda CSS`: Allows precise definition of application theme and simple logic for dark/light modes.
- `Redux`: For state management, standardized across applications.
- `XState`: Implements state machines for generic definition of certain UI elements.
- `ArcGIS JS API`: For advanced mapping capabilities and better alignment with existing services.
- `Vitest`: For unit testing.
- `Playwright`: For end-to-end testing.

### Key Features
- Multiple Projection Support: EPSG:3031, EPSG:3413, EPSG:3857
- Auto-select Projection: Based on current vessel position
- Advanced Map Controls: Zoom, pan, full-screen mode, rotation, and more
- Layer Management: Support for OGC Layers (WMS, WMTS, WFS), data product selection, and layer controls
- Imagery Management: Granule selection, metadata display, and time-based filtering
- Measurement and Drawing Tools: Line measurement, route planning, and import/export capabilities
- Ship/Sensor Tracking: Real-time display of ship position, speed, heading, and depth
- Data Management: API integration for product and granule data with configurable endpoints

### Design
The user interface has been updated to meet modern expectations and improve user experience. You can view the public design files [here](https://www.figma.com/design/3ipFbCWaVlmryeuiZmSkiL/SIIS?node-id=0-1&t=IyJH7ULsPcPzLFHm-1).

### Pre-commit Hooks
This project uses Husky to manage Git hooks. The pre-commit hook is configured to run type checking and linting before allowing a commit. This ensures code quality and consistency across the project. The pre-commit hook does the following:

1. Runs TypeScript type checking (`npm run check-types`)
2. Executes linting on staged files using lint-staged - this is configured to attempt to fix linting errors automatically.

These checks help catch potential issues early in the development process, maintaining code quality and preventing problematic code from being committed.


## License

Copyright (c) 2024 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
