export default function applyValueToPath (root, path, value) {
  if (path.indexOf('.') === -1) {
    root[path] = value;
    return root;
  } else {
    const pathSeg = path.split('.');

    const applySeg = (root, index, value) => {
      if (!root[pathSeg[index]]) {
        root[pathSeg[index]] = {};
      }
      if (index !== pathSeg.length - 1) {
        applySeg(root[pathSeg[index]], index + 1, value);
      } else {
        root[pathSeg[index]] = value;
      }
    };

    applySeg(root, 0, value);

    return root;
  }
}