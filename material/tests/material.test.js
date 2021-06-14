import Material from '../src/material';

test('Material returns colors per vertices', () => {
    let expectedColors = [
        1, 0, 0, 
        1, 0, 0,
        1, 0, 0,
    ]
    let color = {r:1, g:0 ,b:0}
    let material = new Material(color)
    material.setupColors(3)
    expect(material.colors).toEqual(expectedColors);
});