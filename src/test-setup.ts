import '@testing-library/jest-dom'

// Mock WebGL for Three.js in tests
HTMLCanvasElement.prototype.getContext = () => null
