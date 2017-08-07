## Entity

### enable event

  - emit in `engine.createEntity()` when entity instantiated and components added (if any).
  - emit when `entity.enabled` is true and the entity is enabled in hierarchy.
    - it also recursively emit `enable` event in child by depth first rule.
  - emit after `entity.clone()` finished and the entity is enabled in hierarhcy.
  - emit after `entity.deepClone()` finished and the entity is enabled in hierarhcy.
  - emit when entity change parent and `enabledInHierarchy` change to true.

### disable event

  - emit in `entity.destroy()` during `engine._destroyEntity()`.
    - it also recursively emit `disable` event in child by depth first rule.
  - emit when `entity.enabled` is false and the entity is enabled in hierarchy.
    - it also recursively emit `disable` event in child by depth first rule.
  - emit when entity change parent and `enabledInHierarchy` change to false.

### destroy event

  - emit at the end of the tick when `entity.destroy()` invoked.

### parent-changed event

  - emit when `_onParentChanged` triggerred.

## Component

### onEnable

  - trigger in `engine._createComp()` when component instantiated.
  - trigger when entity enabled.

### onDisable

  - trigger in `component.destroy()` during `engine._destroyComp()`.
    - the onDisable will trigger before entity emit `disable` event.
  - trigger when entity disabled.
  - emit at the end of the tick when `component.destroy()` invoked.