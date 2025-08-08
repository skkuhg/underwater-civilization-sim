# 🌊 Underwater Civilization Simulation

An immersive 3D underwater world built with Three.js and WebXR, featuring realistic water physics, bioluminescent life forms, and VR support for exploring an aquatic civilization.

## 🚀 Demo

Experience the underwater world in your browser with full WebXR VR support for compatible devices.

## ✨ Features

### Core Rendering
- **Advanced Three.js Renderer**: ACES tone mapping for cinematic visuals
- **Custom Shader System**: Hand-crafted GLSL shaders for water and sky
- **Real-time Lighting**: Dynamic day-night cycle with sun positioning
- **Post-processing Effects**: Enhanced visual fidelity

### Underwater Environment
- **Realistic Water Physics**: Wave simulation with depth-based coloring
- **Sky Dome Rendering**: Atmospheric scattering with sun highlights
- **Bioluminescent Ecosystem**: Interactive glowing organisms that respond to proximity
- **Architectural Structures**: Transparent dome habitats with detailed bases
- **Environmental Fog**: Depth-based underwater atmosphere

### Interactive Controls
- **Real-time GUI**: Adjust sun elevation, azimuth, exposure, and water properties
- **Camera System**: Smooth navigation through the underwater world
- **WebXR Integration**: Full VR support for compatible headsets

### Technical Features
- **TypeScript**: Full type safety and modern development experience
- **Modular Architecture**: Extensible system design for easy feature addition
- **Performance Optimized**: Efficient rendering for smooth 60fps experience
- **Mobile Ready**: Responsive design for various screen sizes

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern browser with WebGL support

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/underwater-civilization-sim.git
   cd underwater-civilization-sim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls & Usage

### Desktop Controls
- **Mouse**: Look around / Camera rotation
- **WASD**: Move through the environment
- **Scroll**: Zoom in/out
- **GUI Panel**: Adjust environmental parameters

### VR Controls
- **VR Headset**: Natural head movement for looking around
- **VR Controllers**: Point and teleport navigation
- **Hand Tracking**: Direct interaction with GUI elements (if supported)

## 🏗️ Project Structure

```
src/
├── systems/           # Core simulation systems
│   ├── audio.ts      # 3D spatial audio (placeholder)
│   ├── biolife.ts    # Bioluminescent organisms
│   ├── coral.ts      # Coral reef generation
│   ├── domes.ts      # Habitat structures
│   ├── physics.ts    # Physics simulation (placeholder)
│   ├── sky.ts        # Sky dome and lighting
│   ├── water.ts      # Water surface and physics
│   └── xr.ts         # WebXR VR integration
├── shaders/          # Custom GLSL shaders
│   ├── sky.vert.glsl # Sky vertex shader
│   ├── sky.frag.glsl # Sky fragment shader
│   ├── water.vert.glsl # Water vertex shader
│   └── water.frag.glsl # Water fragment shader
├── types.d.ts        # TypeScript type definitions
└── main.ts           # Application entry point
```

## 🔧 Configuration

### Environment Settings
- **Lighting**: Adjust sun position, intensity, and color temperature
- **Water Properties**: Customize wave height, speed, and visual parameters
- **Fog Density**: Control underwater visibility and atmosphere
- **Performance**: Toggle features for optimal performance on your device

### Asset Pipeline
- Place 3D models in `public/assets/`
- Supports GLTF/GLB format for 3D assets
- Use KTX2 compressed textures for optimal performance
- Texture resolution recommendations: 512x512 to 2048x2048

## 🚀 Performance Optimization

### For Best Performance:
- **Desktop**: All features enabled, high-quality settings
- **Mobile**: Reduced particle count, compressed textures
- **VR**: Optimized for 90fps, simplified shaders
- **Low-end devices**: Fallback rendering pipeline

### Optimization Tips:
- Use compressed texture formats (KTX2)
- Keep polygon counts reasonable (<10k per model)
- Enable frustum culling for large scenes
- Use LOD (Level of Detail) for distant objects

## 🔮 Future Roadmap

### Planned Features
- [ ] **Advanced Physics**: Realistic underwater movement and collisions
- [ ] **Spatial Audio**: 3D positional audio with underwater acoustics
- [ ] **Creature AI**: Intelligent fish and marine life behaviors  
- [ ] **Building System**: Construct and customize underwater habitats
- [ ] **Multiplayer**: Shared exploration with other users
- [ ] **Quest System**: Guided exploration and objectives
- [ ] **Weather System**: Underwater currents and environmental effects

### Technical Improvements
- [ ] Advanced lighting system with caustics
- [ ] Procedural coral reef generation
- [ ] Real-time water caustics rendering
- [ ] Enhanced particle systems
- [ ] WASM physics integration
- [ ] Progressive mesh loading

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Include unit tests for new systems

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **WebXR** - VR/AR web standards
- **Vite** - Fast build tool and dev server
- **lil-gui** - Lightweight GUI controls

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/underwater-civilization-sim/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/underwater-civilization-sim/discussions)
- 📧 **Email**: your.email@example.com

---

**Dive into the future of underwater exploration!** 🐠
