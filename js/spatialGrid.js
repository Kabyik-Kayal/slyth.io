// 2D Spatial Hash Grid for high-performance collision detection and viewport culling

export class SpatialGrid {
  constructor(cellSize = 140) {
    this.cellSize = cellSize;
    this.cells = new Map(); // key: string "gx,gy" -> Set of entities
    this.queryId = 0; // Incremented for deduplication without creating temporary sets
  }

  clear() {
    this.cells.clear();
  }

  // Convert world coordinates to cell coordinate
  toCellCoord(val) {
    return Math.floor(val / this.cellSize);
  }

  // Encode two cell coordinates into a single integer key.
  // Using a large prime stride (100003) ensures no collisions within realistic
  // cell ranges (±~75 cells at world-radius 5200 with cell-size 150).
  cellKey(gx, gy) {
    return gx * 100003 + gy;
  }

  // Insert an entity with (x, y, radius)
  insert(entity) {
    const minGx = this.toCellCoord(entity.x - entity.radius);
    const maxGx = this.toCellCoord(entity.x + entity.radius);
    const minGy = this.toCellCoord(entity.y - entity.radius);
    const maxGy = this.toCellCoord(entity.y + entity.radius);

    for (let gx = minGx; gx <= maxGx; gx++) {
      for (let gy = minGy; gy <= maxGy; gy++) {
        const key = this.cellKey(gx, gy);
        let cell = this.cells.get(key);
        if (!cell) {
          cell = [];
          this.cells.set(key, cell);
        }
        cell.push(entity);
      }
    }
  }

  // Query all entities within circular area
  queryCircle(x, y, radius, outResults = []) {
    this.queryId++;
    const currentQueryId = this.queryId;

    const minGx = this.toCellCoord(x - radius);
    const maxGx = this.toCellCoord(x + radius);
    const minGy = this.toCellCoord(y - radius);
    const maxGy = this.toCellCoord(y + radius);

    for (let gx = minGx; gx <= maxGx; gx++) {
      for (let gy = minGy; gy <= maxGy; gy++) {
        const key = this.cellKey(gx, gy);
        const cell = this.cells.get(key);
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const entity = cell[i];
          if (entity._lastQueryId === currentQueryId) continue;
          entity._lastQueryId = currentQueryId;

          // Check distance
          const dx = entity.x - x;
          const dy = entity.y - y;
          const combinedR = radius + entity.radius;
          if (dx * dx + dy * dy <= combinedR * combinedR) {
            outResults.push(entity);
          }
        }
      }
    }

    return outResults;
  }

  // Query all entities intersecting a bounding box (e.g. camera viewport)
  queryRect(minX, minY, maxX, maxY, outResults = []) {
    this.queryId++;
    const currentQueryId = this.queryId;

    const minGx = this.toCellCoord(minX);
    const maxGx = this.toCellCoord(maxX);
    const minGy = this.toCellCoord(minY);
    const maxGy = this.toCellCoord(maxY);

    for (let gx = minGx; gx <= maxGx; gx++) {
      for (let gy = minGy; gy <= maxGy; gy++) {
        const key = this.cellKey(gx, gy);
        const cell = this.cells.get(key);
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const entity = cell[i];
          if (entity._lastQueryId === currentQueryId) continue;
          entity._lastQueryId = currentQueryId;

          // Broad bounding box check
          if (
            entity.x + entity.radius >= minX &&
            entity.x - entity.radius <= maxX &&
            entity.y + entity.radius >= minY &&
            entity.y - entity.radius <= maxY
          ) {
            outResults.push(entity);
          }
        }
      }
    }

    return outResults;
  }
}
