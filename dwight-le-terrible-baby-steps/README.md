# Dwight le terrible - Baby Steps

### _For players new to WarriorJS_

## Level 2

_It's too dark to see anything, but you smell sludge nearby._

> **TIP:** Use `warrior.feel().isEmpty()` to see if there's anything in front of you, and `warrior.attack()` to fight it. Remember, you can only do one action per turn.

### Floor Map

```
╔════════╗
║@   s  >║
╚════════╝

@ = Dwight le terrible (20 HP)
s = Sludge (12 HP)
> = stairs
```

## Abilities

### Actions (only one per turn)

- `warrior.walk()`: Moves one space in the given direction (`'forward'` by default).
- `warrior.attack()`: Attacks a unit in the given direction (`'forward'` by default), dealing 5 HP of damage.

### Senses

- `warrior.think()`: Thinks out loud (`console.log` replacement).
- `warrior.feel()`: Returns the adjacent space in the given direction (`'forward'` by default).

## Next Steps

When you're done editing `Player.js`, run the `warriorjs` command again.
