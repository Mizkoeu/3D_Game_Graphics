# 3D_Game_Graphics
3D Graphics Homework for CG Course

Introduction:

 We use WebGL for shading the objects (vertext and fragment shader). The 3D model json files are provided by AIT-Budapest website.
 This is an exercise for directional, point lighting, Lambertian and Phong-Blinn shading, and shadow mappings, where the gameplay and animations are secondary to the assignment (although still rather fun to play with).

List of Features Completed:
1. Avatar: 
   The flying car is the avatar of our game. You might not be able to see it initially because the trees in the scene are randomly generated, which  means the car may be blocked. 
   Controls: The UP, DOWN, LEFT, RIGHT keys are used to drive the car around and change its head direction. F key should be pressed if you would like to follow the car at a constant camera angle and position. SPACE key is for flying the car at any moment. When SPACE is pressed, the car moves upward/skyward, and when it's release, the car falls down at a given acceleration.

2. Sunshine: 
   A single directional light source from the direction (1, 1, 1) is used to light up the entire game world, as seen.

3. Highlander: 
   The Slowpokes randomly spawned are with Lambertian shading, with different textures/materials such as "normal" and "wooden".

4. Shining:
   The hot air balloons and the car avatar and all the trees in the world are with specular shading. This can be verified by moving the camera around and see that the reflections change accordingly. Camera movements can be achieved by the standard W, A, S, D keys, while Q, E keys are for moving the camera up and down respectively.

5. Spotlight:
   The avatar flying car is equipped with a spotlight always facing the direction that the car itself is facing. The spotlight is located slightly above the car though, since I would like it to illuminate the car front deck a little as well for artistic purpose. The correctness of this feature can be verified by observing the light projected onto the ground. It's pointing directly forward with dimmer and dimmer light as you look away from the main direction. This means the  light is not isotropic. 

6. The Matrix Revolution:
   The avatar has two matric revolutions: its rotor is constantly spinning (it accelerates when the car is flying upward) and its four wheels also rotate while driving. 

7. Ground Zero:
   Ground is implemented with ideal points spanning 4 triangles. However, in this final version, I decided to have only a LARGE ground plane instead of infinite, because the shading gets wacky without writing a whole new shader for the texture mapping of ideal points to finite texture image.

8. Pitch Black:
   Shadows are implementd such that the higher the object is from the ground, the dimmer/more transparent its shadow is. The shadow also moves in the light's projected direction a little as the object gets higher in altitude, although not by a lot.

9. Keep Watching: (PRESS F Key to focus your camera at the avatar constantly)
   As the car is driven around, the camera is automatically looking at the car with reasonable distance, unless the user used W, A, S, D keys to move the camera away from the car. In this case, simply use F key to refocus. The camera will look directly at the car and into the direction of the carfront when F is hit.

10. Who Framed Roger Rabbit:
    The flying car tilts left or right when it turns, both during driving and flying mode. It also tilts upward (pitch up) when it flies up.

11. Planes on a Snake:
    the Slowpokes spawned at random positions in the world are moving around with a parametric equation that describe a circle. However, I did not have enough time to make the objects move in a circle in the yz plane yet.

12. Tracking:

    When T key is pressed, camera moves along a snake path. The camera starts going in a semicircle counterclockwise, before turning around and start moving clockwise in a semicircle. The process repeats itself until T keys is release.  

13. Deaed Solid Perfect:
    Some slowpokes are randomly selected to be given WOOD texture. Sorry for the inconvenience, but you need to find it by driving the car around or fly up for better surveillance. You should be able to easily spot 50% of the slowpokes are WOODEN.

14 & 15. Not implemented yet.

